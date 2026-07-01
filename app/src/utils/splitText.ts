/**
 * Minimal word-splitter — a free stand-in for GSAP SplitText.
 * Wraps each word in `.word > span` so we can track-in (translateY) on reveal.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const raw = el.innerHTML;
  // keep <em>/<br> structure simple: split on spaces, preserve <br>
  const tokens = raw
    .replace(/<br\s*\/?>/gi, " <br> ")
    .split(/\s+/)
    .filter(Boolean);

  el.innerHTML = "";
  const inners: HTMLElement[] = [];

  tokens.forEach((tok) => {
    if (tok.toLowerCase() === "<br>") {
      el.appendChild(document.createElement("br"));
      return;
    }
    const word = document.createElement("span");
    word.className = "word";
    const inner = document.createElement("span");
    inner.innerHTML = tok + "&nbsp;";
    word.appendChild(inner);
    el.appendChild(word);
    inners.push(inner);
  });

  return inners;
}
