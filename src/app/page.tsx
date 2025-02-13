/**
 * Main page of the application
 */

'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Tooltip } from '@heroui/react';
import { Copy, Download, ImageDown } from 'lucide-react';

import { EditorPanel } from '@/ui/editor-panel';

import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { MathDocument } from 'mathjax-full/js/core/MathDocument';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'

const LatexContext = createContext<null | MathDocument<HTMLElement, Text, Document>>(null)

const LatexProvider = ({ children }: PropsWithChildren) => {
  const doc = useMemo(() => {
    if (typeof window == 'undefined') return null as any;
    RegisterHTMLHandler(browserAdaptor());
    return mathjax.document('', { InputJax: new TeX({ packages: AllPackages }), OutputJax: new SVG({ scale: 1.15 }) });
  }, []);

  return (
    <LatexContext.Provider value={doc}>
      {children}
    </LatexContext.Provider>
  )
}

const HTMLElementRenderer = ({ element }: { element?: HTMLElement }) => {
  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !element) return;

    if (element.querySelector('[data-mml-node="merror"]')) return

    ref.current.replaceChildren(element)
  }, [element]);

  return <div ref={ref} />
}


const Latex = ({ input }: { input: string }) => {
  const doc = useContext(LatexContext);

  const result = useMemo(() => {
    if (!doc) return;
    return doc.convert(input, { display: true }) as HTMLElement;
  }, [doc, input]);

  return <HTMLElementRenderer element={result} />
}

async function loadImage(data: string): Promise<HTMLImageElement> {
  const img = document.createElement('img')
  img.src = data
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = data
  })
}

async function toImage(data: string, scale: number, width: number, height: number) {
  const img = await loadImage(data);
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale

  const context = canvas.getContext('2d')
  if (!context) throw new Error("no canvas context");
  context.drawImage(img, 0, 0, width * scale, height * scale)
  return canvas.toDataURL('image/png', 1.0);
}


export default function Home() {
  const [input, setInput] = useState("e^{j\\theta} = \\cos(\\theta) + j \\sin(\\theta)\n");

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const svg = useCallback(() => {
    const serializer = new XMLSerializer();
    const svg = document.querySelector("#latex-equation svg");
    if (!svg) throw new Error('element not found');
    const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
    const data = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    return { data, width: svg.clientWidth, height: svg.clientHeight }
  }, []);

  const image = useCallback(async (format: 'svg' | 'png') => {
    const { data, width, height } = svg();
    if (format === 'svg') return data;
    return await toImage(data, 10.0, width, height);
  }, [svg]);

  const download = useCallback(async (format: 'svg' | 'png') => {
    const data = await image(format);
    const el = document.createElement('a');
    el.href = data;
    el.target = '_blank';
    el.download = `latex-equation.${format}`;
    el.click();
    el.remove();
  }, [image]);


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
          {[
            {
              tooltip: 'Copy',
              isLoading: isCopying,
              onPress: () => {
                setIsCopying(true);
                navigator.clipboard.write([
                  new ClipboardItem({
                    'image/png': new Promise(async (resolve) => {
                      image('png').then(fetch).then(res => res.blob()).then(resolve);
                    }),
                  }),
                ]).finally(() => setIsCopying(false));
              },
              Icon: Copy
            },
            {
              tooltip: 'Download as SVG',
              isLoading: isDownloading,
              onPress: () => {
                setIsDownloading(true);
                download('svg').finally(() => setIsDownloading(false));
              },
              Icon: Download
            },
            {
              tooltip: 'Download as PNG',
              isLoading: isDownloadingPng,
              onPress: () => {
                setIsDownloadingPng(true);
                download('png').finally(() => setIsDownloadingPng(false));
              },
              Icon: ImageDown
            },
          ].map(p => (
            <Tooltip key={p.tooltip} closeDelay={0} className="text-xs" content={p.tooltip}>
              <Button
                variant="bordered"
                isIconOnly
                className="border-1 text-base"
                isLoading={p.isLoading}
                radius="sm"
                onPress={p.onPress}>
                <p.Icon size={18} />
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
    </>
  );
}
