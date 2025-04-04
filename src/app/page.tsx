/**
 * Main page of the application
 */

"use client";

import { useRef, useState } from "react";

import { EditorPanel } from "@/ui/editor-panel";
import { Latex } from "@/ui/latex-panel";
import { Toolbar } from "@/ui/toolbar";

import { imageBlob, download } from "@/lib/image";

export default function Home() {
	const inputRef = useRef<HTMLDivElement>(null);

	const [input, setInput] = useState(
		"\\tag{Stokes theorem}\n\n\\iiint_R \\left( \\nabla \\cdot \\vec F \\right) dV = \\oint_{\\partial R} \\vec F \\cdot  d \\vec S",
	);

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
					download={() => download(inputRef.current, "Latex.png")}
					copy={() =>
						navigator.clipboard?.write?.([
							new ClipboardItem({
								"image/png": (() => imageBlob(inputRef.current, "image/png"))(),
							}),
						])
					}
				/>
			</div>
		</>
	);
}
