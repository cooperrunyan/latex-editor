import html2canvas from "html2canvas";

export const image = (element: HTMLElement) =>
  html2canvas(element, { scale: 10, logging: false, backgroundColor: null });

export const imageBlob = (el: HTMLElement, ty: string, quality = 1) =>
  new Promise<Blob>((res, rej) =>
    image(el).then((ctx) =>
      ctx.toBlob((b) => (b ? res(b) : rej()), ty, quality),
    ),
  );

export const imageDataUrl = (el: HTMLElement, ty: string, quality = 1) =>
  image(el).then((ctx) => ctx.toDataURL(ty, quality));

export const download = async (el: HTMLElement, filename: string) => {
  const a = document.createElement("a");
  a.href = await imageDataUrl(el, "image/png");
  a.target = "_blank";
  a.download = filename;
  a.click();
  a.remove();
};
