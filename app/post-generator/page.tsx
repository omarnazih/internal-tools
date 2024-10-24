'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"

const PostGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    ticketLink: '',
    description: '',
    solution: '',
    prs: ''
  });
  const [generatedPost, setGeneratedPost] = useState('');
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatBulletPoints = (text: string) => {
    return text.split('\n').map(line => `\t• ${line.trim()}`).join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const post = `
Ticket: ${formData.ticketLink}

Description:
${formatBulletPoints(formData.description)}

Solution:
${formatBulletPoints(formData.solution)}

PRs:
${formatBulletPoints(formData.prs)}
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

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Post Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  {key === 'ticketLink' ? (
                    <Input
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder="Enter ticket link"
                    />
                  ) : (
                    <Textarea
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder="Enter points (one per line)"
                    />
                  )}
                </div>
              ))}
              <Button type="submit">Generate Post</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Generated Post</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md min-h-[200px]">
              {generatedPost}
            </pre>
            <Button onClick={copyToClipboard} className="mt-4" disabled={!generatedPost}>
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostGenerator;
