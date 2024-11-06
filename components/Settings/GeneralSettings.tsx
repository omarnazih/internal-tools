'use client';

import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    autoSave: true,
    copyOnGenerate: false,
    defaultTicketPrefix: 'TICKET-',
  });
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('generalSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleChange = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('generalSettings', JSON.stringify(newSettings));
    toast({ title: "Settings saved" });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-save" className="flex flex-col">
            <span>Auto Save</span>
            <span className="font-normal text-sm text-muted-foreground">
              Automatically save changes as you type
            </span>
          </Label>
          <Switch
            id="auto-save"
            checked={settings.autoSave}
            onCheckedChange={(checked) => handleChange('autoSave', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="copy-generate" className="flex flex-col">
            <span>Copy on Generate</span>
            <span className="font-normal text-sm text-muted-foreground">
              Automatically copy content when generated
            </span>
          </Label>
          <Switch
            id="copy-generate"
            checked={settings.copyOnGenerate}
            onCheckedChange={(checked) => handleChange('copyOnGenerate', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket-prefix">Default Ticket Prefix</Label>
          <div className="flex gap-2">
            <Input
              id="ticket-prefix"
              value={settings.defaultTicketPrefix}
              onChange={(e) => handleChange('defaultTicketPrefix', e.target.value)}
              placeholder="Enter default ticket prefix"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 