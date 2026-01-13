'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export type FontOption = 
  | 'ibm-plex-mono'
  | 'times-new-roman'
  | 'just-another-hand'
  | 'comic-sans'
  | 'yomogi';

export type InkColor = 
  | 'black'
  | 'blue'
  | 'blue-black'
  | 'sepia'
  | 'red';

interface FontSelectorProps {
  selectedFont: FontOption;
  onFontChange: (font: FontOption) => void;
  selectedInk: InkColor;
  onInkChange: (ink: InkColor) => void;
}

const fonts: { value: FontOption; label: string; fontFamily: string }[] = [
  { value: 'ibm-plex-mono', label: 'IBM Plex Mono', fontFamily: '"IBM Plex Mono", monospace' },
  { value: 'times-new-roman', label: 'Times New Roman', fontFamily: '"Times New Roman", Times, serif' },
  { value: 'just-another-hand', label: 'Just Another Hand', fontFamily: '"Just Another Hand", cursive' },
  { value: 'comic-sans', label: 'Comic Sans', fontFamily: '"Comic Sans MS", "Comic Sans", cursive' },
  { value: 'yomogi', label: 'Yomogi', fontFamily: '"Yomogi", cursive' },
];

const inks: { value: InkColor; label: string; color: string }[] = [
  { value: 'black', label: 'Black', color: '#1a1a1a' },
  { value: 'blue', label: 'Blue', color: '#1e40af' },
  { value: 'blue-black', label: 'Blue-Black', color: '#1e3a5f' },
  { value: 'sepia', label: 'Sepia', color: '#704214' },
  { value: 'red', label: 'Red', color: '#991b1b' },
];

export function getFontFamily(font: FontOption): string {
  return fonts.find(f => f.value === font)?.fontFamily || fonts[0].fontFamily;
}

export function getInkColor(ink: InkColor): string {
  return inks.find(i => i.value === ink)?.color || inks[0].color;
}

function getFontLabel(font: FontOption): string {
  return fonts.find(f => f.value === font)?.label || fonts[0].label;
}

function getInkLabel(ink: InkColor): string {
  return inks.find(i => i.value === ink)?.label || inks[0].label;
}

export function FontSelector({ selectedFont, onFontChange, selectedInk, onInkChange }: FontSelectorProps) {
  const selectedFontData = fonts.find(f => f.value === selectedFont);
  const selectedInkData = inks.find(i => i.value === selectedInk);
  
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">Font</Label>
        <Select 
          value={selectedFont} 
          onValueChange={(value) => onFontChange(value as FontOption)}
        >
          <SelectTrigger style={{ fontFamily: selectedFontData?.fontFamily }}>
            <span>{getFontLabel(selectedFont)}</span>
          </SelectTrigger>
          <SelectContent>
            {fonts.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.fontFamily }}
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm text-gray-600">Ink Color</Label>
        <Select 
          value={selectedInk} 
          onValueChange={(value) => onInkChange(value as InkColor)}
        >
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300" 
                style={{ backgroundColor: selectedInkData?.color }}
              />
              <span style={{ color: selectedInkData?.color }}>{getInkLabel(selectedInk)}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {inks.map((ink) => (
              <SelectItem key={ink.value} value={ink.value}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300" 
                    style={{ backgroundColor: ink.color }}
                  />
                  <span style={{ color: ink.color }}>{ink.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
