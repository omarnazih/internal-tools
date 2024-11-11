'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommandList } from './CommandList';
import type { Command } from './types';

export const BranchRenaming: React.FC = () => {
  const [oldBranch, setOldBranch] = useState('');
  const [newBranch, setNewBranch] = useState('');

  const renamingCommands: Command[] = [
    {
      description: "1. Rename branch locally",
      command: `git branch -m ${oldBranch} ${newBranch}`
    },
    {
      description: "2. Delete the old branch on remote",
      command: `git push origin :${oldBranch}`
    },
    {
      description: "3. Push the new branch to remote",
      command: `git push origin ${newBranch}`
    },
    {
      description: "4. Reset the upstream branch",
      command: `git push origin -u ${newBranch}`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="old-branch">Current Branch Name</Label>
          <Input
            id="old-branch"
            value={oldBranch}
            onChange={(e) => setOldBranch(e.target.value)}
            placeholder="Enter current branch name"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="new-branch">New Branch Name</Label>
          <Input
            id="new-branch"
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            placeholder="Enter new branch name"
          />
        </div>
      </div>
      
      {oldBranch && newBranch && (
        <CommandList commands={renamingCommands} />
      )}
    </div>
  );
}; 