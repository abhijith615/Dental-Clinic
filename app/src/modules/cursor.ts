import { gsap } from "gsap";

/**
 * Magnetic, fluid custom cursor.
 *  - dot follows the pointer 1:1
 *  - ring trails with inertia
 *  - elements tagged `.magnetic` pull toward the cursor
 *  - `data-cursor="TEXT"` swaps the ring into a labelled state
 */
export function initCursor(): void {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.getElementById("cursor")!;
  const label = document.getElementById("cursorLabel")!;
  const dot = cursor.querySelector(".cursor__dot") as HTMLElement;
  const ring = cursor.querySelector(".cursor__ring") as HTMLElement;

  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
  const lblX = gsap.quickTo(label, "x", { duration: 0.5, ease: "power3" });
  const lblY = gsap.quickTo(label, "y", { duration: 0.5, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
    lblX(e.clientX);
    lblY(e.clientY);
  });

  window.addEventListener("mousedown", () => cursor.classList.add("is-down"));
  window.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

  // ---- magnetic + state-change targets ----
  const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

  const magnets = document.querySelectorAll<HTMLElement>(".magnetic");
  magnets.forEach((el) => {
    const strength = parseFloat(el.dataset.magnet || "0.35");
    // cap the pull so large elements only nudge subtly
    const cap = parseFloat(el.dataset.magnetCap || "18");
    const moveX = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });

    el.addEventListener("mouseenter", () => {
      cursor.classList.add("is-hover");
      label.textContent = el.dataset.cursor || "";
    });
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      moveX(clamp(relX * strength, cap));
      moveY(clamp(relY * strength, cap));
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hover");
      label.textContent = "";
      moveX(0);
      moveY(0);
    });
  });
}
