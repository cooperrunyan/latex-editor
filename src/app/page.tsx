/**
 * Main page of the application
 */

'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Tooltip } from '@heroui/react';
import { Download } from 'lucide-react';

import { EditorPanel } from '@/ui/editor-panel';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { browserAdaptor} from 'mathjax-full/js/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'

const LatexContext = createContext<null | MathDocument<HTMLElement, Text, Document>>(null)

const LatexProvider = ({children}: PropsWithChildren) => {
  const doc = useMemo(() => {
    RegisterHTMLHandler(browserAdaptor());
    return mathjax.document('', {InputJax: new TeX({packages: AllPackages}), OutputJax: new SVG({ scale: 1.15 })});
  }, []);

  return (
    <LatexContext.Provider value={doc}>
      {children}
    </LatexContext.Provider>
  )
}

const HTMLElementRenderer = ({ element }: {element?: HTMLElement }) => {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !element) return;

    if (element.querySelector('[data-mml-node="merror"]')) return

    ref.current.replaceChildren(element)
  }, [element]);  

  return <div ref={ref} />
}


const Latex = ({input}: {input: string}) => {
  const doc = useContext(LatexContext);

  const result = useMemo(() => {
    if (!doc) return;
    return doc.convert(input, {display: true}) as HTMLElement; 
  }, [doc, input]);
  
  return <HTMLElementRenderer element={result}/>
}

export default function Home() {
  const [input, setInput] = useState("e^{j\\theta} = \\cos(\\theta) + j \\sin(\\theta)\n");

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
            <LatexProvider>
              <Latex input={input} />
            </LatexProvider>
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
