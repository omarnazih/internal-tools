'use client';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export default function EncodingForm() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const encodeString = () => {
    const encodedText = btoa(btoa(btoa(inputText)));
    setOutputText(encodedText);
  };

  const handleInputChange = (event:any) => {
    setInputText(event.target.value);
    if(event.target.value === '') setOutputText('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Input</Label>
        <Textarea id="encode-input" placeholder="Enter text to encode" rows={3} onChange={handleInputChange} value={inputText} />
      </div>
      <div className="space-y-2">
        <Label>Output</Label>
        <Textarea id="encode-output" readOnly rows={3} value={outputText} />
      </div>
      <Button className="w-full" onClick={encodeString}>Encode</Button>
    </div>
  );
}
