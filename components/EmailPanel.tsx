'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, Save, Send, Loader2 } from 'lucide-react';

interface EmailPanelProps {
  myEmail: string;
  recipientEmail: string;
  onMyEmailChange: (email: string) => void;
  onRecipientEmailChange: (email: string) => void;
  onSave: () => void;
  onSend: () => void;
  onLetterFound: (content: string) => void;
}

export function EmailPanel({
  myEmail,
  recipientEmail,
  onMyEmailChange,
  onRecipientEmailChange,
  onSave,
  onSend,
  onLetterFound,
}: EmailPanelProps) {
  const [hasExistingLetter, setHasExistingLetter] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Check for existing letter when email changes
  const checkForLetter = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) {
      setHasExistingLetter(false);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`/api/letters/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      setHasExistingLetter(data.hasLetter);
      
      if (data.hasLetter && data.letterContent) {
        onLetterFound(data.letterContent);
      }
    } catch (error) {
      console.error('Error checking for letter:', error);
      setHasExistingLetter(false);
    } finally {
      setIsChecking(false);
    }
  }, [onLetterFound]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      checkForLetter(myEmail);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [myEmail, checkForLetter]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setHasExistingLetter(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
          <Label htmlFor="my-email" className="text-sm text-gray-600">
            My email is
          </Label>
          <div className="relative">
            <Input
              id="my-email"
              type="email"
              placeholder="you@example.com"
              value={myEmail}
              onChange={(e) => onMyEmailChange(e.target.value)}
              className="pr-10"
            />
            {isChecking && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            {!isChecking && hasExistingLetter && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">Letter found</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="recipient-email" className="text-sm text-gray-600">
            Recipient&apos;s email is
          </Label>
          <Input
            id="recipient-email"
            type="email"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => onRecipientEmailChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={!myEmail || isSaving}
            className="flex-1"
            variant="outline"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </Button>
          <Button
            onClick={handleSend}
            disabled={!myEmail || !recipientEmail || isSending}
            className="flex-1"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </div>
  );
}

