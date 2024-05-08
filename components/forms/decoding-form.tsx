'use client';
import React, { useState } from 'react';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export default function DecodingForm() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  const decodeString = () => {
    // Perform Base64 decoding
    const decodedText = atob(atob(atob(inputText)));
    setOutputText(decodedText);
  };

  const handleInputChange = (event:any) => {
    setInputText(event.target.value);
    if(event.target.value === '') setOutputText('');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Input</Label>
        <Textarea id="decode-input" placeholder="Enter Base64 string to decode" rows={3} onChange={handleInputChange} value={inputText} />
      </div>
      <div className="space-y-2">
        <Label>Output</Label>
        <Textarea id="decode-output" readOnly rows={3} value={outputText} />
      </div>
      <Button className="w-full" onClick={decodeString}>Decode</Button>
    </div>
  );
}
