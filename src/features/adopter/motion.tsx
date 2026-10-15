"use client";
import { ReactNode, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const positions = useRef<Record<string, number>>({});
  const restore = useRef(false);
  useEffect(() => {
    const save = () => {
      positions.current[location.pathname] = window.scrollY;
    };
    const navigate = (event: MouseEvent) => {
      if ((event.target as Element).closest("a[href]")) save();
    };
    const back = () => {
      restore.current = true;
    };
    document.addEventListener("click", navigate, true);
    window.addEventListener("popstate", back);
    return () => {
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", back);
    };
  }, []);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1051px) and (pointer: fine)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const content =
            root.current?.querySelector<HTMLElement>(".pk-motion-content");
          if (!content) return;
          const desktop = context.conditions.desktop;
          const smoother = desktop
            ? ScrollSmoother.create({
                wrapper: root.current!,
                content,
                smooth: 0.6,
                effects: false,
                smoothTouch: false,
              })
            : null;
          const frame = restore.current
            ? requestAnimationFrame(() => {
                const y = positions.current[path] || 0;
                if (smoother) smoother.scrollTo(y, false);
                else window.scrollTo(0, y);
                restore.current = false;
              })
            : null;
          gsap.utils
            .toArray<HTMLElement>(".pk-vision-panel, .pk-location", content)
            .forEach((section) => {
              gsap.from(section, {
                y: 18,
                duration: 0.5,
                clearProps: "transform",
                scrollTrigger: {
                  trigger: section,
                  start: "top 90%",
                  once: true,
                },
              });
            });
          const anchors = (event: MouseEvent) => {
            const a = (event.target as Element).closest<HTMLAnchorElement>(
              "a[href]",
            );
            if (
              !a ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            const url = new URL(a.href);
            if (
              url.pathname !== location.pathname ||
              url.search !== location.search ||
              !url.hash
            )
              return;
            const target = document.getElementById(
              decodeURIComponent(url.hash.slice(1)),
            );
            if (!target) return;
            event.preventDefault();
            history.pushState(null, "", url.hash);
            if (smoother) smoother.scrollTo(target, true, "top 110px");
            else target.scrollIntoView({ behavior: "smooth" });
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          };
          document.addEventListener("click", anchors);
          const observer = new ResizeObserver(() => ScrollTrigger.refresh());
          observer.observe(content);
          return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            document.removeEventListener("click", anchors);
            observer.disconnect();
            smoother?.kill();
          };
        },
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [path], revertOnUpdate: true },
  );
  return (
    <div ref={root} className="pk-motion-wrapper">
      <div className="pk-motion-content">{children}</div>
    </div>
  );
}
