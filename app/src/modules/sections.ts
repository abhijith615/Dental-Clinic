import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { splitWords } from "../utils/splitText";

/**
 * Boots every downstream section: scroll reveals, count-up stats, the
 * immersive cursor-following services preview, and the testimonial marquees.
 */
export function initSections(): void {
  revealHeadings();
  revealFades();
  countUpStats();
  bandParallax();
  testimonialMarquees();
}

/* ---------- section titles track in word-by-word ---------- */
function revealHeadings() {
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    if (el.closest("#sec1") || el.closest("#hero")) return; // handled elsewhere
    const words = splitWords(el);
    gsap.to(words, {
      y: 0,
      duration: 1,
      ease: "expo.out",
      stagger: 0.05,
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });
}

/* ---------- generic fade-up, batched per proximity ---------- */
function revealFades() {
  ScrollTrigger.batch("[data-fade]", {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.09,
        overwrite: true,
      }),
  });
}

/* ---------- animated statistics ---------- */
function countUpStats() {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count || "0");
    const divide = parseFloat(el.dataset.divide || "1");
    const suffix = el.dataset.suffix || "";
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            const val = obj.v / divide;
            el.textContent =
              (divide > 1 ? val.toFixed(1) : Math.round(val).toString()) + suffix;
          },
        }),
    });
  });
}

/* ---------- parallax image band ---------- */
function bandParallax() {
  const bg = document.querySelector<HTMLElement>(".band__bg");
  if (!bg) return;
  gsap.fromTo(
    bg,
    { yPercent: -12 },
    {
      yPercent: 12,
      ease: "none",
      scrollTrigger: {
        trigger: ".band",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

/* ---------- testimonial marquees (seamless, opposite directions) ---------- */
function testimonialMarquees() {
  const tracks = gsap.utils.toArray<HTMLElement>(".voices__track");
  tracks.forEach((track) => {
    const dir = parseInt(track.dataset.dir || "1", 10);

    // duplicate cards for a seamless loop
    track.innerHTML += track.innerHTML;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const half = (track.scrollWidth + gap) / 2; // exact loop period
    const speed = 42; // px per second
    const duration = half / speed;

    const from = dir === 1 ? 0 : -half;
    const to = dir === 1 ? -half : 0;

    const tween = gsap.fromTo(
      track,
      { x: from },
      { x: to, duration, ease: "none", repeat: -1 }
    );

    // pause on hover, and subtly nudge speed with scroll velocity
    track.addEventListener("mouseenter", () => gsap.to(tween, { timeScale: 0, duration: 0.4 }));
    track.addEventListener("mouseleave", () => gsap.to(tween, { timeScale: 1, duration: 0.4 }));
  });
}
