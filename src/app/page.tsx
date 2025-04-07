/**
 * Main page of the application
 */

"use client";

import { useRef, useState } from "react";

import { EditorPanel } from "@/ui/editor-panel";
import { Latex } from "@/ui/latex-panel";
import { Toolbar } from "@/ui/toolbar";

import { imageBlob, download } from "@/lib/image";

const DEFAULT_INPUT = String.raw`\begin{align} 
   
\iiint_R \left( \nabla \cdot \vec F \right) dV = \oint_{\partial R} \vec F \cdot  d \vec S

\\\\ \tag{Step}  u(t) = \begin{cases} 
 0 & t < 0 \\
 1 & t \ge 0
\end{cases} 

\\\\ \begin{bmatrix} 
        1 & 2 & 3 \\
        4 & 1 & 8 \\
        0 & 5 & 1
     \end{bmatrix}  
     \xrightarrow{\operatorname{rref}}
     \begin{bmatrix} 
        1 & 0 & 0 \\
        0 & 1 & 0 \\
        0 & 0 & 1
     \end{bmatrix} 

\\\\ \overbrace{a+b+c}^{\text{note}} && {a \brack b} && a \over b

\end{align}`;

export default function Home() {
  const inputRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState(DEFAULT_INPUT);

  return (
    <>
      <div className="flex h-screen flex-col *:h-full *:max-h-[calc(50%-1rem)]">
        <div className="flex w-full flex-wrap items-center overflow-auto first:*:ml-auto last:*:mr-auto">
          <div ref={inputRef} className="flex items-center px-8 py-4">
            <Latex>{input}</Latex>
          </div>
        </div>
        <div className="flex flex-row border-t-1.5 *:w-full dark:border-t-default-50">
          <EditorPanel input={input} setInput={setInput} />
        </div>
        <Toolbar
          className="absolute bottom-4 right-4"
          download={async () => {
            if (!inputRef.current) return;
            return download(inputRef.current, "Latex.png");
          }}
          copy={() =>
            navigator.clipboard?.write?.([
              new ClipboardItem({
                "image/png": (async () => {
                  if (!inputRef.current) return null as never;
                  return imageBlob(inputRef.current, "image/png");
                })(),
              }),
            ])
          }
        />
      </div>
    </>
  );
}
