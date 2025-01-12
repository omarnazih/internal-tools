'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { QuickAccessBranches, type Branch } from "@/components/QuickAccessBranches";

const PostGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    tickets: '',
    description: '',
    solution: '',
    testingPlan: '',
    branch: 'qa-hotfixes',
    prs: '',
    documentationLink: ''
  });
  const [generatedPost, setGeneratedPost] = useState('');
  const { toast } = useToast()
  const [spellErrors, setSpellErrors] = useState<{word: string, suggestions: string[]}[]>([]);

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

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:h-[calc(100vh-2rem)] overflow-auto">
          <CardHeader>
            <CardTitle>Code Review Post Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Information */}
              <div className="space-y-4">
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
                    className="min-h-[80px]"
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
                    className="min-h-[120px]"
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
                    className="min-h-[120px]"
                  />
                </div>
              </div>

              {/* Testing and Documentation */}
              <div className="space-y-4 pt-2 border-t">
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
                    className="min-h-[80px]"
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
                  />
                </div>
              </div>

              {/* Branch and PRs */}
              <div className="space-y-4 pt-2 border-t">
                <div>
                  <Label className="text-lg font-semibold mb-2 block">Branch Selection</Label>
                  <QuickAccessBranches
                    defaultBranches={defaultBranches}
                    selectedBranch={formData.branch}
                    onBranchSelect={(branchName) => setFormData(prev => ({ ...prev, branch: branchName }))}
                  />
                  <div className="mt-2">
                    <Label htmlFor="custom-branch">Custom Branch</Label>
                    <Input
                      id="custom-branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="Enter custom branch name"
                    />
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
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Generate Post</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="lg:h-[calc(100vh-2rem)] overflow-auto">
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-[calc(100vh-15rem)]"
              value={generatedPost}
              onChange={handleGeneratedPostChange}
              placeholder="Generated post will appear here"
            />
            <Button onClick={copyToClipboard} disabled={!generatedPost} className="w-full">
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostGenerator;
