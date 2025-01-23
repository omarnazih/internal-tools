'use client';

import React from 'react';
import { CommandList } from './CommandList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Command } from './types';

interface BranchCreationProps {
  ticketNumber: string;
  sourceBranch: string;
}

export const BranchCreation: React.FC<BranchCreationProps> = ({
  ticketNumber,
  sourceBranch
}) => {
  const prodCommands: Command[] = [
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
      command: `gh pr create --base ${sourceBranch} --title "[${ticketNumber}] - [${sourceBranch}]" --body "This PR is for [${ticketNumber}] on [${sourceBranch}] branch" --web`
    }     
  ];

  const devCommands: Command[] = [
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

  return (
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
  );
}; 