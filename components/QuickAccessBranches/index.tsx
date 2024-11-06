'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type Branch = {
  name: string;
  variant: 'outline';
};

interface QuickAccessBranchesProps {
  defaultBranches: Branch[];
  selectedBranch: string;
  onBranchSelect: (branchName: string) => void;
}

export const QuickAccessBranches: React.FC<QuickAccessBranchesProps> = ({
  defaultBranches,
  selectedBranch,
  onBranchSelect,
}) => {
  const [branches, setBranches] = useState<Branch[]>(defaultBranches);

  useEffect(() => {
    const savedBranches = localStorage.getItem('quickAccessBranches');
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    }
  }, []);

  return (
    <div className="space-y-2">
      <Label>Branch</Label>
      <div className="flex flex-wrap gap-2">
        {branches.map((branch) => (
          <Button
            key={branch.name}
            variant={branch.variant}
            size="sm"
            onClick={() => onBranchSelect(branch.name)}
            className={cn(
              "text-sm text-nowrap",
              selectedBranch === branch.name && "bg-accent text-accent-foreground"
            )}
          >
            {branch.name}
          </Button>
        ))}
      </div>
    </div>
  );
}; 