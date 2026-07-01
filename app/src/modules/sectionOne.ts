import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "../utils/splitText";

/**
 * Section 1 — the background-video panel that fluidly "pulls up" into the
 * pinned hero, then pins itself while its copy tracks in.
 */
export function initSectionOne(): void {
  const video = document.getElementById("sec1Video") as HTMLVideoElement;
  const pin = document.getElementById("sec1Pin")!;

  // ---- fluid pull-up: the rounded panel rises & flattens as it meets the hero
  gsap.fromTo(
    pin,
    { yPercent: 12, borderRadius: "48px 48px 0 0", scale: 0.96 },
    {
      yPercent: 0,
      borderRadius: "0px 0px 0 0",
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#sec1",
        start: "top bottom",
        end: "top top",
        scrub: 0.8,
      },
    }
  );

  // ---- pin the panel while content plays ----
  ScrollTrigger.create({
    trigger: "#sec1",
    start: "top top",
    end: "bottom bottom",
    pin: pin,
    pinSpacing: false,
  });

  // ---- play video only while visible (perf) ----
  ScrollTrigger.create({
    trigger: "#sec1",
    start: "top 80%",
    end: "bottom top",
    onEnter: () => video.play().catch(() => {}),
    onEnterBack: () => video.play().catch(() => {}),
    onLeave: () => video.pause(),
    onLeaveBack: () => video.pause(),
  });

  // ---- split-text track-in on the copy ----
  const splits = document.querySelectorAll<HTMLElement>("#sec1 [data-split]");
  splits.forEach((el) => {
    const inners = splitWords(el);
    gsap.to(inners, {
      y: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.04,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });
  });

  // ---- lateral scrim on the headline as it enters ----
  gsap.fromTo(
    ".sec1__head",
    { letterSpacing: "0.06em", opacity: 0.5 },
    {
      letterSpacing: "-0.02em",
      opacity: 1,
      ease: "none",
      scrollTrigger: { trigger: ".sec1__head", start: "top 90%", end: "top 50%", scrub: true },
    }
  );
}
