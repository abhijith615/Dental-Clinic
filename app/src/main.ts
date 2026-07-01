import "./style.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { initSmoothScroll } from "./modules/smoothScroll";
import { runPreloader } from "./modules/preloader";
import { initCursor } from "./modules/cursor";
import { initHeroVideo } from "./modules/heroVideo";
import { playHeroEntrance } from "./modules/heroEntrance";
import { initSectionOne } from "./modules/sectionOne";
import { initTouchLines } from "./modules/touchLines";
import { initSections } from "./modules/sections";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.body.classList.add("is-loading");

/* ------------------------------------------------------------------ *
 *  Boot
 * ------------------------------------------------------------------ */
initCursor();

// cinematic 4K film hero
const hero = initHeroVideo();

runPreloader(hero.ready, () => {
  initSmoothScroll();

  hero.play();
  initSectionOne();
  initTouchLines();
  initSections();

  ScrollTrigger.refresh();

  // entrance — grid + meta + headline + icey cards
  playHeroEntrance();

  window.addEventListener("load", () => ScrollTrigger.refresh());
});
