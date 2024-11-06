'use client';

import { useTheme } from "next-themes";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from 'react';

export const ThemeSettings = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('reduceMotion');
    if (saved) {
      setReduceMotion(JSON.parse(saved));
    }
  }, []);

  const handleReduceMotion = (checked: boolean) => {
    setReduceMotion(checked);
    localStorage.setItem('reduceMotion', JSON.stringify(checked));
    document.documentElement.style.setProperty('--reduce-motion', checked ? 'reduce' : 'no-preference');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Theme Preference</Label>
          <RadioGroup
            defaultValue={theme}
            onValueChange={setTheme}
            className="mt-2 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="flex flex-col">
            <span>Reduce Motion</span>
            <span className="font-normal text-sm text-muted-foreground">
              Minimize animations throughout the application
            </span>
          </Label>
          <Switch
            id="reduce-motion"
            checked={reduceMotion}
            onCheckedChange={handleReduceMotion}
          />
        </div>
      </div>
    </div>
  );
}; 