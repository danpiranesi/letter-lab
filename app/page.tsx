'use client';

import { Letter } from '@/components/Letter';
import { SelectionTools } from '@/components/SelectionTools';
import { defaultConfig } from '@/config/defaults';

export default function Home() {
  // Format the current date
  const date = new Date().toLocaleDateString(
    defaultConfig.locale,
    defaultConfig.dateFormat
  );

  return (
    <>
      <Letter config={defaultConfig} date={date} />
      <SelectionTools />
    </>
  );
}

