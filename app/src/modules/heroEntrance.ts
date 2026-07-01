import { gsap } from "gsap";
import { splitWords } from "../utils/splitText";

/**
 * Hero entrance — fires the moment the preloader clears:
 *  1. grid lines draw in
 *  2. top meta + eyebrow fade up
 *  3. the big headline tracks in word-by-word
 *  4. the icey cards clip-reveal and stack, ~1.2s apart
 */
export function playHeroEntrance(): void {
  // pre-split the headline lines into animatable words
  const lines = gsap.utils.toArray<HTMLElement>("#hero [data-split]");
  const lineWords = lines.map((el) => splitWords(el));

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  // 1 ── grid reveal
  tl.to(".grid__v", {
    scaleY: 1,
    duration: 1.2,
    stagger: { each: 0.07, from: "center" },
  })
    .to(".grid__h", { scaleX: 1, duration: 1.1 }, "-=0.9")
    .fromTo(
      ".nav",
      { yPercent: -120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );

  // 2 ── meta + eyebrow
  tl.fromTo(
    "#hero [data-reveal]",
    { y: 16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
    "-=0.6"
  );

  // 3 ── headline tracks in, line by line
  lineWords.forEach((words, i) => {
    tl.to(
      words,
      { y: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 },
      i === 0 ? "-=0.3" : "-=0.9"
    );
  });

  // 4 ── icey cards stack in, ~1.2s rhythm
  const boxes = gsap.utils.toArray<HTMLElement>("[data-box]");
  boxes.forEach((box, i) => {
    tl.to(
      box,
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        duration: 1.0,
        ease: "expo.out",
      },
      i === 0 ? ">-0.4" : ">+1.1"
    );
  });

  // scroll hint + its pulsing line
  tl.fromTo(
    "#scrollHint",
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.8 },
    "<"
  );
  gsap.to("#scrollHint .hero__scrollhint-line", {
    scaleY: 0.4,
    transformOrigin: "top",
    repeat: -1,
    yoyo: true,
    duration: 1.1,
    ease: "sine.inOut",
  });
}
