import { gsap } from "gsap";

/**
 * Numerical preloader (0 → 100). Counts up smoothly and only releases once
 * the hero scene is `ready` AND the window has loaded AND a minimum dwell has
 * passed — so the entrance never starts on a half-built frame.
 */
export function runPreloader(ready: Promise<void>, onComplete: () => void): void {
  const elCount = document.getElementById("count")!;
  const elBar = document.getElementById("bar")!;
  const elStatus = document.getElementById("ploadstatus")!;
  const preloader = document.getElementById("preloader")!;

  const progress = { v: 0 };
  const start = performance.now();
  const MIN_MS = 1700;

  let sceneReady = false;
  let pageReady = false;

  const render = () => {
    const n = Math.round(progress.v);
    elCount.textContent = String(n);
    gsap.set(elBar, { scaleX: progress.v / 100 });
    if (n > 33) elStatus.innerHTML = "FORGING&nbsp;THE&nbsp;ENAMEL";
    if (n > 72) elStatus.innerHTML = "CHILLING&nbsp;THE&nbsp;RING";
    if (n >= 100) elStatus.innerHTML = "WELCOME&nbsp;TO&nbsp;HIMA";
  };

  // crawl toward 90 while assets settle…
  gsap.to(progress, {
    v: 90,
    duration: 2.2,
    ease: "power1.out",
    onUpdate: render,
  });

  let finished = false;
  function maybeFinish() {
    if (finished) return;
    if (!sceneReady || !pageReady) return;
    const wait = Math.max(0, MIN_MS - (performance.now() - start));
    finished = true;
    gsap.to(progress, {
      v: 100,
      duration: 0.6,
      delay: wait / 1000,
      ease: "power2.out",
      onUpdate: render,
      onComplete: exit,
    });
  }

  function exit() {
    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = "none";
        document.body.classList.remove("is-loading");
        onComplete();
      },
    });
    tl.to(".preloader__inner", {
      y: -28,
      opacity: 0,
      duration: 0.6,
      ease: "power3.in",
    }).to(
      preloader,
      { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" },
      "-=0.2"
    );
  }

  ready.then(() => {
    sceneReady = true;
    maybeFinish();
  });

  if (document.readyState === "complete") pageReady = true;
  else window.addEventListener("load", () => {
    pageReady = true;
    maybeFinish();
  });

  // in case load already fired
  setTimeout(() => {
    if (document.readyState === "complete") {
      pageReady = true;
      maybeFinish();
    }
  }, 100);

  render();
}
