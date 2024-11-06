'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Branch } from "@/components/QuickAccessBranches";

const STORAGE_KEY = 'quickAccessBranches';

export const BranchSettings: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newBranch, setNewBranch] = useState('');
  const { toast } = useToast();

  const defaultBranches: Branch[] = [
    { name: 'main', variant: 'outline' },
    { name: 'hotfixes', variant: 'outline' },
    { name: 'qa-hotfixes', variant: 'outline' },
    { name: 'pre-hotfixes', variant: 'outline' },
    { name: 'dev', variant: 'outline' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setBranches(JSON.parse(saved));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBranches));
      setBranches(defaultBranches);
    }
  }, []);

  const addBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.trim()) return;

    const branchName = newBranch.trim();
    if (branches.some(b => b.name === branchName)) {
      toast({
        variant: "destructive",
        title: "Branch already exists"
      });
      return;
    }

    const updatedBranches = [
      ...branches,
      { name: branchName, variant: 'outline' }
    ];

    setBranches(updatedBranches as Branch[]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBranches));
    setNewBranch('');
    toast({ title: "Branch added to quick access" });
  };

  const removeBranch = (branchName: string) => {
    const isDefault = defaultBranches.some(b => b.name === branchName);
    if (isDefault) {
      toast({
        variant: "destructive",
        title: "Cannot remove default branch"
      });
      return;
    }

    const updatedBranches = branches.filter(b => b.name !== branchName);
    setBranches(updatedBranches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBranches));
    toast({ title: "Branch removed from quick access" });
  };

  const resetToDefault = () => {
    setBranches(defaultBranches);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBranches));
    toast({ title: "Reset to default branches" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Quick Access Branches</Label>
          <Button
            variant="destructive"
            size="sm"
            onClick={resetToDefault}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Reset to Default
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {branches.map((branch) => (
            <div key={branch.name} className="flex items-center gap-1">
              <div className={cn(
                "px-3 py-1 text-sm rounded-md border flex items-center justify-center",
                defaultBranches.some(b => b.name === branch.name) 
                  ? "bg-secondary text-secondary-foreground" 
                  : "bg-background text-foreground"
              )}>
                {branch.name}
                {!defaultBranches.some(b => b.name === branch.name) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeBranch(branch.name)}
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <form 
          className="flex gap-2"
          onSubmit={addBranch}
        >
          <Input
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            placeholder="Add new quick access branch"
            className="max-w-[200px]"
          />
          <Button type="submit" size="default" variant="outline">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}; 