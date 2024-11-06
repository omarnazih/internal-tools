'use client';

import { Label } from "@/components/ui/label";

export const KeyboardShortcuts = () => {
  const shortcuts = [
    { key: '⌘ + K', description: 'Open Command Palette' },
    { key: '⌘ + C', description: 'Copy Generated Content' },
    { key: '⌘ + S', description: 'Save Changes' },
    { key: '⌘ + /', description: 'Show Keyboard Shortcuts' },
    { key: 'Esc', description: 'Close Modal/Popup' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 