import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";

import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import type { MathDocument } from "mathjax-full/js/core/MathDocument";
import { browserAdaptor } from "mathjax-full/js/adaptors/browserAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";

const LatexContext = createContext<null | MathDocument<
	HTMLElement,
	Text,
	Document
>>(null);

const LatexProvider = ({ children }: PropsWithChildren) => {
	const doc = useMemo(() => {
		if (typeof window === "undefined") return null as never;
		RegisterHTMLHandler(browserAdaptor());
		return mathjax.document("", {
			InputJax: new TeX({ packages: AllPackages }),
			OutputJax: new SVG({ scale: 1.15 }),
		});
	}, []);

	return <LatexContext.Provider value={doc}>{children}</LatexContext.Provider>;
};

const HTMLElementRenderer = ({ element }: { element?: HTMLElement }) => {
	const ref = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current || !element) return;

		if (element.querySelector('[data-mml-node="merror"]')) return;

		ref.current.replaceChildren(element);
	}, [element]);

	return <div ref={ref} />;
};

const InnerLatex = ({ input }: { input: string }) => {
	const doc = useContext(LatexContext);

	const result = useMemo(() => {
		if (!doc) return;
		return doc.convert(input, { display: true }) as HTMLElement;
	}, [doc, input]);

	return <HTMLElementRenderer element={result} />;
};

export const Latex = ({ children }: { children: string }) => (
	<LatexProvider>
		<InnerLatex input={children} />
	</LatexProvider>
);
