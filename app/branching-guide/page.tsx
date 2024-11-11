'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickAccessBranches, type Branch } from "@/components/QuickAccessBranches";
import { BranchCreation } from "@/components/BranchingGuide/BranchCreation";
import { BranchRenaming } from "@/components/BranchingGuide/BranchRenaming";

const BranchingGuide: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [sourceBranch, setSourceBranch] = useState('qa-hotfixes');

  const defaultBranches: Branch[] = [
    { name: 'master', variant: 'outline' },
    { name: 'hotfixes', variant: 'outline' },
    { name: 'qa-hotfixes', variant: 'outline' },
    { name: 'pre-hotfixes', variant: 'outline' },
    { name: 'dev', variant: 'outline' },
  ];

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <Card>
        <CardHeader>
          <CardTitle>Git Branching Guide</CardTitle>
          <CardDescription>Generate git commands for your ticket</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Branch</TabsTrigger>
              <TabsTrigger value="rename">Rename Branch</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-6">
              <QuickAccessBranches
                defaultBranches={defaultBranches}
                selectedBranch={sourceBranch}
                onBranchSelect={setSourceBranch}
              />
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-2/3">
                  <Label htmlFor="ticket">Ticket Number</Label>
                  <Input
                    id="ticket"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    placeholder="Enter ticket number (e.g., 123)"
                    className="w-full"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="source">Source Branch</Label>
                  <Input
                    id="source"
                    value={sourceBranch}
                    onChange={(e) => setSourceBranch(e.target.value)}
                    placeholder="Enter branch name"
                    className="w-full"
                  />
                </div>
              </div>

              {ticketNumber && (
                <BranchCreation 
                  ticketNumber={ticketNumber}
                  sourceBranch={sourceBranch}
                />
              )}
            </TabsContent>

            <TabsContent value="rename">
              <BranchRenaming />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchingGuide;