'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { QuickAccessBranches, type Branch } from "@/components/QuickAccessBranches";

const BranchingGuide: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [sourceBranch, setSourceBranch] = useState('qa-hotfixes');
  const { toast } = useToast();

  const defaultBranches: Branch[] = [
    { name: 'master', variant: 'outline' },
    { name: 'hotfixes', variant: 'outline' },
    { name: 'qa-hotfixes', variant: 'outline' },
    { name: 'pre-hotfixes', variant: 'outline' },
    { name: 'dev', variant: 'outline' },
  ];

  const prodCommands = [
    {
      description: `1. Update ${sourceBranch} branch`,
      command: `git checkout ${sourceBranch} && git pull origin ${sourceBranch}`
    },
    {
      description: "2. Create and checkout new branch",
      command: `git checkout -b ${ticketNumber}`
    },
    {
      description: "3. Push branch to remote",
      command: `git push -u origin ${ticketNumber}`
    },
    {
      description: "4. Create a pull request",
      command: `gh pr create --base ${sourceBranch} --title "${ticketNumber} - ${sourceBranch}" --body "This PR is for ${ticketNumber} on ${sourceBranch} branch" --web`
    }     
  ];

  const devCommands = [
    {
      description: "1. Update dev branch",
      command: "git checkout dev && git pull origin dev"
    },
    {
      description: "2. Create and checkout new branch",
      command: `git checkout -b ${ticketNumber}-dev`
    },
    {
      description: "3. Push branch to remote",
      command: `git push -u origin ${ticketNumber}-dev`
    },
    {
      description: "4. Create a pull request",
      command: `gh pr create --base dev --title "${ticketNumber} - dev" --body "This PR is for ${ticketNumber} on dev branch" --web`
    }      
  ];

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      toast({ title: "Command copied to clipboard" });
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to copy command" });
    });
  };

  const CommandList = ({ commands }: { commands: typeof prodCommands }) => (
    <div className="space-y-4">
      {commands.map((item, index) => (
        <div key={index} className="space-y-2">
          <p className="text-sm font-medium">{item.description}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 bg-muted rounded-md">
              {item.command}
            </code>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => copyCommand(item.command)}
            >
              Copy
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Git Branching Guide</CardTitle>
          <CardDescription>Generate git commands for your ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <QuickAccessBranches
              defaultBranches={defaultBranches}
              selectedBranch={sourceBranch}
              onBranchSelect={setSourceBranch}
            />
            <div className="flex gap-4">
              <div>
                <Label htmlFor="ticket">Ticket Number</Label>
                <Input
                  id="ticket"
                  value={ticketNumber}
                  onChange={(e) => setTicketNumber(e.target.value)}
                  placeholder="Enter ticket number (e.g., 123)"
                  className="max-w-xs"
                />
              </div>
              <div>
                <Label htmlFor="source">Source Branch</Label>
                <Input
                  id="source"
                  value={sourceBranch}
                  onChange={(e) => setSourceBranch(e.target.value)}
                  placeholder="Enter branch name"
                  className="w-[180px]"
                />
              </div>
            </div>
            
            {ticketNumber && (
              <Tabs defaultValue="main" className="w-full">
                <TabsList>
                  <TabsTrigger value="main">Source Branch</TabsTrigger>
                  <TabsTrigger value="dev">Dev Branch</TabsTrigger>
                </TabsList>
                <TabsContent value="main">
                  <CommandList commands={prodCommands} />
                </TabsContent>
                <TabsContent value="dev">
                  <CommandList commands={devCommands} />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchingGuide;