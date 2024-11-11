'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Command } from './types';

interface CommandListProps {
  commands: Command[];
}

export const CommandList: React.FC<CommandListProps> = ({ commands }) => {
  const { toast } = useToast();

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command).then(() => {
      toast({ title: "Command copied to clipboard" });
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to copy command" });
    });
  };

  return (
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
}; 