'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchSettings } from "@/components/Settings/BranchSettings";
import { ThemeSettings } from "@/components/Settings/ThemeSettings";
import { GeneralSettings } from "@/components/Settings/GeneralSettings";
import { KeyboardShortcuts } from "@/components/Settings/KeyboardShortcuts";

const Settings: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage settings for all tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="branches">Branches</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="branches">
              <BranchSettings />
            </TabsContent>
            <TabsContent value="appearance">
              <ThemeSettings />
            </TabsContent>
            <TabsContent value="shortcuts">
              <KeyboardShortcuts />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 