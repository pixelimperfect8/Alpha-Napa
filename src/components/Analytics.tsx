"use client";

import { useEffect, useRef, useCallback } from "react";

interface QueuedEvent {
  event_type: string;
  metadata?: Record<string, unknown>;
  session_id: string;
  referrer?: string;
}

function getSessionId(): string {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("_sid", id);
  }
  return id;
}

export default function Analytics() {
  const queue = useRef<QueuedEvent[]>([]);
  const firedScrollDepths = useRef(new Set<number>());
  const firedSections = useRef(new Set<string>());
  const startTime = useRef(Date.now());
  const sessionId = useRef("");

  const enqueue = useCallback((event_type: string, metadata?: Record<string, unknown>) => {
    queue.current.push({
      event_type,
      metadata,
      session_id: sessionId.current,
      referrer: document.referrer || undefined,
    });
  }, []);

  const flush = useCallback(() => {
    if (queue.current.length === 0) return;
    const payload = JSON.stringify({ events: queue.current });
    queue.current = [];

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/events",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/events", {
        method: "POST",
        body: payload,
        keepalive: true,
        headers: { "Content-Type": "application/json" },
      });
    }
  }, []);

  useEffect(() => {
    sessionId.current = getSessionId();

    // Page view
    enqueue("page_view");

    // Scroll depth tracking
    const checkScrollDepth = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !firedScrollDepths.current.has(milestone)) {
          firedScrollDepths.current.add(milestone);
          enqueue("scroll_depth", { depth: milestone });
        }
      }
    };

    // Section visibility via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id =
              entry.target.id ||
              entry.target.getAttribute("data-section") ||
              "unknown";
            if (!firedSections.current.has(id)) {
              firedSections.current.add(id);
              enqueue("section_view", { section_id: id });
            }
          }
        }
      },
      { threshold: 0 }
    );

    // Observe all sections after a short delay (let page render)
    const observeTimer = setTimeout(() => {
      document.querySelectorAll("section[id]").forEach((el) => {
        observer.observe(el);
      });
    }, 1000);

    // CTA click tracking
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("[data-track]");
      if (target) {
        enqueue("cta_click", {
          action: target.getAttribute("data-track"),
        });
      }
    };
    document.addEventListener("click", handleClick);

    // Scroll listener (throttled)
    let scrollTick = false;
    const handleScroll = () => {
      if (!scrollTick) {
        scrollTick = true;
        requestAnimationFrame(() => {
          checkScrollDepth();
          scrollTick = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Time on page heartbeat
    const heartbeat = setInterval(() => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      enqueue("time_on_page", { seconds });
    }, 30000);

    // Flush interval
    const flushInterval = setInterval(flush, 5000);

    // Flush on page unload
    const handleUnload = () => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      enqueue("time_on_page", { seconds });
      flush();
    };
    window.addEventListener("beforeunload", handleUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleUnload();
    });

    return () => {
      clearTimeout(observeTimer);
      clearInterval(heartbeat);
      clearInterval(flushInterval);
      observer.disconnect();
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [enqueue, flush]);

  return null;
}
