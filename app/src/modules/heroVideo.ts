import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface HeroVideo {
  ready: Promise<void>;
  play: () => void;
}

/**
 * Cinematic video hero:
 *  - the 4K film plays on loop, covered to the viewport
 *  - the section pins while scroll drives a slow push-in (Ken-Burns) on the
 *    video and parallaxes / dissolves the editorial overlay
 */
export function initHeroVideo(): HeroVideo {
  const video = document.getElementById("heroVideo") as HTMLVideoElement;

  const ready = new Promise<void>((resolve) => {
    if (video.readyState >= 2) resolve();
    else {
      video.addEventListener("loadeddata", () => resolve(), { once: true });
      video.addEventListener("error", () => resolve(), { once: true });
    }
  });

  function play() {
    video.play().catch(() => {});
  }

  // ---- pinned cinematic scrub ----
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=260%",
      scrub: 0.7,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    },
  });

  // slow push-in + drift on the film
  tl.to("#heroVideo", { scale: 1.22, yPercent: -4, ease: "none" }, 0)
    // headline tracks up & fades first
    .to("#heroOverlay .hero__headline", { yPercent: -40, opacity: 0, ease: "none" }, 0)
    // meta + cards parallax at their own pace
    .to("#heroOverlay .hero__meta", { yPercent: -120, opacity: 0, ease: "none" }, 0)
    .to("#heroLeft", { yPercent: 60, opacity: 0, ease: "none" }, 0)
    .to("#heroRight", { yPercent: 60, opacity: 0, ease: "none" }, 0)
    .to(".grid", { opacity: 0, ease: "none" }, 0)
    // darken into the section-1 hand-off
    .to(".hero__vignette", { opacity: 1.6, ease: "none" }, 0);

  // scroll hint fades almost immediately
  gsap.to("#scrollHint", {
    opacity: 0,
    scrollTrigger: { trigger: "#hero", start: "top top", end: "6% top", scrub: true },
  });

  // pause the film when the hero is well out of view (perf)
  ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    onLeave: () => video.pause(),
    onEnterBack: () => play(),
  });

  return { ready, play };
}
