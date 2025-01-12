'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, Copy, Save, Wand2, FileDown, Sun, Moon, Trash2 } from "lucide-react";
import { QuickAccessBranches, type Branch } from "@/components/QuickAccessBranches";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Template {
  name: string;
  data: Partial<typeof initialFormData>;
}

const initialFormData = {
  tickets: '',
  description: '',
  solution: '',
  testingPlan: '',
  branch: 'qa-hotfixes',
  prs: '',
  documentationLink: ''
};

const defaultTemplates: Template[] = [
  {
    name: "Default Template",
    data: {
      tickets: "https://trustsecurenow.atlassian.net/browse/CAN-911",
      description: "Fix the bug in the login page",
      solution: "Add a new validation rule for the password",
      branch: "qa-hotfixes",
    }
  },
];

const PostGenerator: React.FC = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [generatedPost, setGeneratedPost] = useState('');
  const [spellErrors, setSpellErrors] = useState<{word: string, suggestions: string[]}[]>([]);
  const [customBranches, setCustomBranches] = useState<Branch[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('custom-branches');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [savedTemplates, setSavedTemplates] = useState<Template[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('post-generator-templates');
      return stored ? [...defaultTemplates, ...JSON.parse(stored)] : defaultTemplates;
    }
    return defaultTemplates;
  });
  const { toast } = useToast();
  const { theme, setTheme } = useTheme(); 

  const defaultBranches: Branch[] = [
    { name: 'master', variant: 'outline' },
    { name: 'hotfixes', variant: 'outline' },
    { name: 'qa-hotfixes', variant: 'outline' },
    { name: 'pre-hotfixes', variant: 'outline' },
    { name: 'dev', variant: 'outline' },
  ];

  const parseGeneratedPost = (text: string) => {
    try {
      const sections: Record<string, string> = {};
      let currentSection = '';
      let content: string[] = [];

      text.split('\n').forEach(line => {
        if (line.trim() === '') return;

        if (line.toLowerCase().includes('ticket')) {
          if (currentSection && content.length) {
            sections[currentSection.toLowerCase()] = content
              .map(item => item.trim().replace(/^[•\-]\s*/, ''))
              .join('\n');
          }
          currentSection = 'tickets';
          content = [];
        } else if (line.endsWith(':')) {
          if (currentSection && content.length) {
            sections[currentSection.toLowerCase()] = content
              .map(item => item.trim().replace(/^[•\-]\s*/, ''))
              .join('\n');
          }
          currentSection = line.replace(':', '').trim();
          content = [];
        } else {
          content.push(line);
        }
      });

      // Save last section
      if (currentSection && content.length) {
        sections[currentSection.toLowerCase()] = content
          .map(item => item.trim().replace(/^[•\-]\s*/, ''))
          .join('\n');
      }

      // Extract branch from PRs section
      const prSection = sections['prs'] || '';
      const branchMatch = prSection.match(/\(([\w-]+)\)/);
      const branch = branchMatch ? branchMatch[1] : formData.branch;

      setFormData(prev => ({
        ...prev,
        tickets: sections['tickets'] || prev.tickets,
        description: sections['description'] || prev.description,
        solution: sections['solution'] || prev.solution,
        testingPlan: sections['testing plan'] || prev.testingPlan,
        branch: branch,
        prs: prSection.split('\n')
          .map(pr => pr.replace(/^.*-> /, '').trim())
          .join('\n'),
        documentationLink: sections['documentation'] || prev.documentationLink
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Parse error",
        description: "Could not parse the content format"
      });
    }
  };

  const checkSpelling = async (text: string) => {
    if (!('spellcheck' in document.createElement('textarea'))) {
      return; // Browser doesn't support spellcheck
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    const words = text.split(/\s+/);
    const errors: {word: string, suggestions: string[]}[] = [];

    for (const word of words) {
      if (word.trim()) {
        textarea.value = word;
        const misspelled = !textarea.spellcheck;
        if (misspelled) {
          // Get suggestions if available
          const suggestions = await new Promise<string[]>((resolve) => {
            textarea.addEventListener('spellchecksuggestions', (event: any) => {
              resolve(event.detail?.suggestions || []);
            }, { once: true });
            textarea.dispatchEvent(new Event('spellcheck'));
          });
          errors.push({ word, suggestions });
        }
      }
    }

    document.body.removeChild(textarea);
    setSpellErrors(errors);

    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: "Spelling/Grammar Issues Found",
        description: `Found ${errors.length} potential issues in description`,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check spelling for description field
    if (name === 'description') {
      checkSpelling(value);
    }

    // Regenerate post when fields change
    const updatedData = { ...formData, [name]: value };
    const post = `
Tickets: 
${formatBulletPoints(updatedData.tickets)}

Description:
${formatBulletPoints(updatedData.description)}

Solution:
${formatBulletPoints(updatedData.solution)}
${updatedData.testingPlan ? `\nTesting Plan:\n${formatBulletPoints(updatedData.testingPlan)}` : ''}

PRs:
${formatPRs(updatedData.branch, updatedData.prs)}
${updatedData.documentationLink ? `\nDocumentation:\n\t• ${updatedData.documentationLink}` : ''}
    `.trim();
    setGeneratedPost(post);
  };

  const formatBulletPoints = (text: string) => {
    return text.split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        // Split on newlines within the line and maintain tabbing
        const subLines = line.split('\n');
        return subLines.map((subLine, subIndex) => 
          subIndex === 0 ? `\t• ${subLine}` : `\t  ${subLine}`
        ).join('\n');
      })
      .join('\n');
  };

  const formatPRs = (branch: string, prs: string) => {
    return prs.split('\n').map(pr => {
      const trimmedPR = pr.trim();
      const githubRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/\d+/;
      const match = trimmedPR.match(githubRegex);
      
      if (match) {
        const repoName = match[2];
        return `\t• ${repoName} (${branch}) -> ${trimmedPR}`;
      } else {
        return `\t• (${branch}) -> ${trimmedPR}`;
      }
    }).join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post = `
Tickets: 
${formatBulletPoints(formData.tickets)}

Description:
${formatBulletPoints(formData.description)}

Solution:
${formatBulletPoints(formData.solution)}
${formData.testingPlan ? `\nTesting Plan:\n${formatBulletPoints(formData.testingPlan)}` : ''}

PRs:
${formatPRs(formData.branch, formData.prs)}
${formData.documentationLink ? `\nDocumentation:\n\t• ${formData.documentationLink}` : ''}
    `.trim();
    setGeneratedPost(post);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost).then(() => {
      toast({ title: "Copied to clipboard" });
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to copy" });
    });
  };

  const handleGeneratedPostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setGeneratedPost(newValue);
    parseGeneratedPost(newValue);
  };

  const handleTemplateSelect = (templateName: string) => {
    const template = savedTemplates.find(t => t.name === templateName);
    if (template) {
      setFormData(prev => ({
        ...prev,
        ...template.data
      }));
      toast({
        title: "Template Applied",
        description: `Applied template: ${templateName}`
      });
    }
  };

  const saveAsTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (templateName) {
      const newTemplate = {
        name: templateName,
        data: formData
      };
      setSavedTemplates(prev => {
        const updated = [...prev, newTemplate];
        // Save only user templates (exclude default ones)
        const userTemplates = updated.slice(defaultTemplates.length);
        localStorage.setItem('post-generator-templates', JSON.stringify(userTemplates));
        return updated;
      });
      toast({
        title: "Template Saved",
        description: `Saved template: ${templateName}`
      });
    }
  };

  const deleteTemplate = (templateName: string) => {
    if (defaultTemplates.some(t => t.name === templateName)) {
      toast({
        variant: "destructive",
        title: "Cannot delete default template",
        description: "Default templates cannot be deleted"
      });
      return;
    }

    if (confirm(`Are you sure you want to delete template "${templateName}"?`)) {
      setSavedTemplates(prev => {
        const updated = prev.filter(t => t.name !== templateName);
        // Save only user templates (exclude default ones)
        const userTemplates = updated.slice(defaultTemplates.length);
        localStorage.setItem('post-generator-templates', JSON.stringify(userTemplates));
        return updated;
      });
      toast({
        title: "Template Deleted",
        description: `Deleted template: ${templateName}`
      });
    }
  };

  const clearForm = () => {
    if (confirm("Are you sure you want to clear all fields?")) {
      setFormData(initialFormData);
      setGeneratedPost('');
      toast({
        title: "Form Cleared",
        description: "All fields have been reset"
      });
    }
  };

  const saveCustomBranch = () => {
    const branchName = formData.branch.trim();
    if (!branchName) {
      toast({
        variant: "destructive",
        title: "Invalid Branch Name",
        description: "Please enter a branch name"
      });
      return;
    }

    if (defaultBranches.some(b => b.name === branchName) || 
        customBranches.some(b => b.name === branchName)) {
      toast({
        variant: "destructive",
        title: "Branch Already Exists",
        description: "This branch name is already saved"
      });
      return;
    }

    const newBranch: Branch = { name: branchName, variant: 'outline' };
    setCustomBranches(prev => {
      const updated = [...prev, newBranch];
      localStorage.setItem('custom-branches', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Branch Saved",
      description: `Saved branch: ${branchName}`
    });
  };

  const deleteCustomBranch = (branchName: string) => {
    setCustomBranches(prev => {
      const updated = prev.filter(b => b.name !== branchName);
      localStorage.setItem('custom-branches', JSON.stringify(updated));
      return updated;
    });

    toast({
      title: "Branch Deleted",
      description: `Deleted branch: ${branchName}`
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Code Review Post Generator</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Form Input</CardTitle>
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Wand2 className="h-4 w-4 mr-2" />
                        Templates
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {savedTemplates.map((template) => (
                        <DropdownMenuItem
                          key={template.name}
                          className="flex items-center justify-between"
                        >
                          <span
                            className="flex-1 cursor-pointer"
                            onClick={() => handleTemplateSelect(template.name)}
                          >
                            {template.name}
                          </span>
                          {!defaultTemplates.some(t => t.name === template.name) && (
                            <Trash2
                              className="h-4 w-4 ml-2 cursor-pointer hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(template.name);
                              }}
                            />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" onClick={saveAsTemplate}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearForm}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="main" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="main">Main Info</TabsTrigger>
                  <TabsTrigger value="testing">Testing & Docs</TabsTrigger>
                  <TabsTrigger value="branch">Branch & PRs</TabsTrigger>
                </TabsList>

                <TabsContent value="main" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="tickets" className="text-lg font-semibold">
                      Tickets
                    </Label>
                    <Textarea
                      id="tickets"
                      name="tickets"
                      value={formData.tickets}
                      onChange={handleChange}
                      placeholder="Enter ticket numbers (one per line)"
                      className="min-h-[80px] font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-lg font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description points (one per line)"
                      className="min-h-[120px] font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="solution" className="text-lg font-semibold">
                      Solution
                    </Label>
                    <Textarea
                      id="solution"
                      name="solution"
                      value={formData.solution}
                      onChange={handleChange}
                      placeholder="Enter solution points (one per line)"
                      className="min-h-[120px] font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="testing" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="testingPlan" className="text-lg font-semibold">
                      Testing Plan (Optional)
                    </Label>
                    <Textarea
                      id="testingPlan"
                      name="testingPlan"
                      value={formData.testingPlan}
                      onChange={handleChange}
                      placeholder="Enter testing steps (optional)"
                      className="min-h-[120px] font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentationLink" className="text-lg font-semibold">
                      Documentation Link (Optional)
                    </Label>
                    <Input
                      id="documentationLink"
                      name="documentationLink"
                      value={formData.documentationLink}
                      onChange={handleChange}
                      placeholder="Enter documentation link"
                      className="font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="branch" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-lg font-semibold mb-2 block">Branch Selection</Label>
                    <QuickAccessBranches
                      defaultBranches={defaultBranches}
                      selectedBranch={formData.branch}
                      onBranchSelect={(branchName) => setFormData(prev => ({ ...prev, branch: branchName }))}
                    />
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="custom-branch">Custom Branch</Label>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={saveCustomBranch}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Branch
                          </Button>
                        </div>
                      </div>
                      <Input
                        id="custom-branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        placeholder="Enter custom branch name"
                        className="font-mono"
                      />
                      {customBranches.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm text-muted-foreground mb-2 block">Saved Custom Branches</Label>
                          <div className="flex flex-wrap gap-2">
                            {customBranches.map((branch) => (
                              <div
                                key={branch.name}
                                className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1 hover:bg-transparent"
                                  onClick={() => setFormData(prev => ({ ...prev, branch: branch.name }))}
                                >
                                  {branch.name}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1 hover:bg-transparent hover:text-destructive"
                                  onClick={() => deleteCustomBranch(branch.name)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prs" className="text-lg font-semibold">
                      Pull Requests
                    </Label>
                    <Textarea
                      id="prs"
                      name="prs"
                      value={formData.prs}
                      onChange={handleChange}
                      placeholder="Enter PR links (one per line)"
                      className="min-h-[120px] font-mono"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6">
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                  Generate Post
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-t-4 border-t-secondary lg:h-[calc(100vh-8rem)] overflow-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Generated Post</CardTitle>
                <CardDescription>Preview and copy your generated post</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!generatedPost}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[calc(100vh-20rem)] font-mono"
              value={generatedPost}
              onChange={handleGeneratedPostChange}
              placeholder="Generated post will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostGenerator;
