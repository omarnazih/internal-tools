'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PostGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    tickets: '',
    description: '',
    solution: '',
    branch: 'qa-hotfixes',
    prs: ''
  });
  const [generatedPost, setGeneratedPost] = useState('');
  const { toast } = useToast()

  const quickAccessBranches = [
    { name: 'master', variant: 'outline' as const },
    { name: 'hotfixes', variant: 'outline' as const },
    { name: 'qa-hotfixes', variant: 'outline' as const },
    { name: 'pre-hotfixes', variant: 'outline' as const },
    { name: 'dev', variant: 'outline' as const },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatBulletPoints = (text: string) => {
    return text.split('\n').map(line => `\t• ${line.trim()}`).join('\n');
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

PRs:
${formatPRs(formData.branch, formData.prs)}
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
    setGeneratedPost(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Code Review Post Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['tickets', 'description', 'solution'].map((key) => (
                <div key={key}>
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Textarea
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder="Enter points (one per line)"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label>Branch</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {quickAccessBranches.map((branch) => (
                    <Button
                      key={branch.name}
                      variant={branch.variant}
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData(prev => ({ ...prev, branch: branch.name }));
                      }}
                      className={cn(
                        "text-sm",
                        formData.branch === branch.name && "bg-accent text-accent-foreground"
                      )}
                    >
                      {branch.name}
                    </Button>
                  ))}
                </div>
                <Input
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Enter branch name"
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="prs">PRs</Label>
                <Textarea
                  id="prs"
                  name="prs"
                  value={formData.prs}
                  onChange={handleChange}
                  placeholder="Enter PR links or text (one per line)"
                />
              </div>
              <Button type="submit">Generate Post</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[200px] mb-4"
              value={generatedPost}
              onChange={handleGeneratedPostChange}
              placeholder="Generated post will appear here"
            />
            <Button onClick={copyToClipboard} disabled={!generatedPost}>
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostGenerator;
