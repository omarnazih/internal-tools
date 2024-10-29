'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Base64Converter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('decode');
  const [iterations, setIterations] = useState('3');
  const { toast } = useToast();

  const handleConvert = () => {
    try {
      let result = input;
      const iterCount = parseInt(iterations);

      for (let i = 0; i < iterCount; i++) {
        if (mode === 'encode') {
          result = btoa(result);
        } else {
          result = atob(result);
        }
      }

      setOutput(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Conversion failed",
        description: "Please check your input and try again."
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      toast({ title: "Copied to clipboard" });
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to copy" });
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Base64 Converter</CardTitle>
          <CardDescription>Encode or decode Base64 strings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="input">Input</Label>
              <Textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or decode"
                className="min-h-[100px]"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="mode">Mode</Label>
                <Select value={mode} onValueChange={setMode}>
                  <SelectTrigger id="mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encode">Encode</SelectItem>
                    <SelectItem value="decode">Decode</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="iterations">Iterations</Label>
                <Input
                  id="iterations"
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>
            </div>
            <Button onClick={handleConvert}>Convert</Button>
            <div>
              <Label htmlFor="output">Output</Label>
              <Textarea
                id="output"
                value={output}
                readOnly
                placeholder="Converted text will appear here"
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={copyToClipboard} disabled={!output}>
              Copy to Clipboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Base64Converter;
