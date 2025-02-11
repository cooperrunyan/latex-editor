/**
 * Main page of the application
 */

'use client';

import { useState } from 'react';

import { Button, Tooltip } from '@heroui/react';
import { Download } from 'lucide-react';

import { EditorPanel } from '@/ui/editor-panel';
import { MathJax } from 'better-react-mathjax'

export default function Home() {
  'use client';

  const [input, setInput] = useState("$$\ne^{j\\theta} = \\cos(\\theta) + j \\sin(\\theta)\n$$\n");

  const [isDownloading, setIsDownloading] = useState(false);

  const dataurl = () => {
    const serializer = new XMLSerializer();
    const svg = document.querySelector("#latex-equation svg");
    if (!svg) throw new Error('element not found');
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    return  "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
  }

  const handleDownload = () => {
    try {
      const el = document.createElement('a');
      el.href = dataurl();
      el.target = '_blank';
      el.download = 'latex-equation.svg';
      el.click();
      el.remove();
    } catch (error) {
      throw error;
    }
    
  }

  return (
    <>
      <div className="flex h-screen flex-col *:h-full *:max-h-[calc(50%-1rem)]">
        <div className="flex w-full flex-wrap items-center overflow-auto first:*:ml-auto last:*:mr-auto">
          <div className="flex items-center px-8 py-4" id="latex-equation">
            <MathJax dynamic typesettingOptions={{fn: 'tex2svg' }}>{input}</MathJax>
          </div>
        </div>
        <div className="flex flex-row border-t-1.5 *:w-full dark:border-t-default-50">
          <EditorPanel input={input} setInput={setInput} />
        </div>
        <div className="absolute bottom-4 right-4 flex !h-fit gap-2">
          <Tooltip
            disableAnimation
            closeDelay={0}
            className="text-xs"
            content="Download"
          >
            <Button
              aria-label="Download LaTeX code as a file"
              variant="bordered"
              isIconOnly
              className="border-1 text-base"
              isLoading={isDownloading}
              radius="sm"
              onPress={handleDownload}
            >
              <Download size={18} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
