'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const JsonFormatter: React.FC = () => {
  const [inputJson, setInputJson] = useState(`{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "isStudent": false
}`);
  const [formattedJson, setFormattedJson] = useState('');
  const [tabSpacing, setTabSpacing] = useState('4');
  const [wrap, setWrap] = useState(false);
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, Number(tabSpacing));
      setFormattedJson(formatted);
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Invalid JSON", 
        description: "Please enter valid JSON" 
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson).then(() => {
      toast({ title: "Copied to clipboard" });
    }).catch(() => {
      toast({ variant: "destructive", title: "Failed to copy" });
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[200px] mb-4"
              value={inputJson}
              onChange={handleInputChange}
              placeholder="Enter your JSON here"
            />
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="tab-spacing">Tab Spacing:</Label>
                <Select value={tabSpacing} onValueChange={setTabSpacing}>
                  <SelectTrigger id="tab-spacing">
                    <SelectValue placeholder="Select tab spacing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="wrap-mode"
                  checked={wrap}
                  onCheckedChange={setWrap}
                />
                <Label htmlFor="wrap-mode">Wrap text</Label>
              </div>
              <Button onClick={formatJson}>Format JSON</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Formatted JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre
                className={`min-h-[200px] mb-4 p-4 bg-gray-100 rounded-md overflow-auto ${
                  wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
                }`}
                style={{ maxHeight: '400px' }}
              >
                {formattedJson || 'Formatted JSON will appear here'}
              </pre>
              <div className="absolute top-2 right-2">
                <Button onClick={copyToClipboard} disabled={!formattedJson} size="sm">
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JsonFormatter;
