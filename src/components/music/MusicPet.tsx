"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { FiArrowUpRight, FiX } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa6";
import { NowPlaying } from "./NowPlaying";
import { useNowPlaying } from "./useNowPlaying";
import styles from "./MusicPet.module.scss";

type Position = { x: number; y: number };
const POSITION_KEY = "music-pet-position";

function keepInView(position: Position): Position {
  const mobile = window.innerWidth <= 768;
  const size = mobile ? 50 : 56;
  return {
    x: Math.max(16, Math.min(position.x, window.innerWidth - size - 16)),
    y: Math.max(16, Math.min(position.y, window.innerHeight - size - (mobile ? 100 : 16))),
  };
}

function savePosition(position: Position) {
  try {
    localStorage.setItem(
      POSITION_KEY,
      JSON.stringify({
        x: position.x / window.innerWidth,
        y: position.y / window.innerHeight,
      }),
    );
  } catch {
    /* Position persistence is optional. */
  }
}

function MusicPetFace({ playing }: { playing: boolean }) {
  return (
    <svg
      className={`${styles.face} ${playing ? styles.listening : ""}`}
      viewBox="0 0 56 56"
      aria-hidden="true"
    >
      <ellipse cx="28" cy="49" rx="14" ry="2" fill="currentColor" opacity=".08" />
      <g className={styles.character}>
        <path d="M19 41v4m18-4v4" stroke="#273d31" strokeWidth="4" strokeLinecap="round" />
        <rect
          x="12"
          y="14"
          width="32"
          height="30"
          rx="13"
          fill="#d1eedc"
          stroke="#273d31"
          strokeWidth="1.6"
        />
        <path
          d="M10 29v-5a18 18 0 0 1 36 0v5"
          fill="none"
          stroke="#273d31"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="7"
          y="25"
          width="7"
          height="13"
          rx="3.5"
          fill="#359e65"
          stroke="#273d31"
          strokeWidth="1.5"
        />
        <rect
          x="42"
          y="25"
          width="7"
          height="13"
          rx="3.5"
          fill="#359e65"
          stroke="#273d31"
          strokeWidth="1.5"
        />
        <g className={styles.eyes} fill="#273d31">
          <ellipse cx="22" cy="29" rx="1.7" ry="2.3" />
          <ellipse cx="34" cy="29" rx="1.7" ry="2.3" />
        </g>
        <path
          d="M25 35q3 3 6 0"
          fill="none"
          stroke="#273d31"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function MusicPet() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{ id: number; start: Position; origin: Position; moved: boolean } | null>(
    null,
  );
  const suppressClick = useRef(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const [panelPlacement, setPanelPlacement] = useState({ left: 0, below: false, height: 420 });
  const [tooltipPlacement, setTooltipPlacement] = useState({ left: 0, top: 0 });
  const pathname = usePathname();
  const { data, loading } = useNowPlaying();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(POSITION_KEY) ?? "null");
      if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) {
        setPosition(
          keepInView({ x: saved.x * window.innerWidth, y: saved.y * window.innerHeight }),
        );
      }
    } catch {
      /* Use the default location when no saved position is available. */
    }
    const resize = () => setPosition((current) => (current ? keepInView(current) : null));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useLayoutEffect(() => {
    const placeTooltip = () => {
      const anchor = triggerRef.current?.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip || window.innerWidth <= 768) return;
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const gap = 10;
      const margin = 16;
      const fitsLeft = anchor.left - gap - width >= margin;
      const fitsRight = anchor.right + gap + width <= window.innerWidth - margin;
      let left = fitsLeft ? anchor.left - gap - width : anchor.right + gap;
      let top = anchor.top + (anchor.height - height) / 2;
      if (!fitsLeft && !fitsRight) {
        left = anchor.left + (anchor.width - width) / 2;
        top = anchor.top - height - gap >= margin ? anchor.top - height - gap : anchor.bottom + gap;
      }
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - height - margin));
      setTooltipPlacement({ left: left - anchor.left, top: top - anchor.top });
    };
    placeTooltip();
    const observer = new ResizeObserver(placeTooltip);
    if (tooltipRef.current) observer.observe(tooltipRef.current);
    window.addEventListener("resize", placeTooltip);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placeTooltip);
    };
  }, [position]);

  useLayoutEffect(() => {
    if (!open) return;
    const placePanel = () => {
      const anchor = triggerRef.current?.getBoundingClientRect();
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const width = Math.min(320, window.innerWidth - 32);
      const topSpace = anchor.top - 28;
      const bottomSpace = window.innerHeight - anchor.bottom - 28;
      const below = topSpace < Math.min(panel.scrollHeight, 260) && bottomSpace > topSpace;
      const left =
        Math.max(16, Math.min(anchor.right - width, window.innerWidth - width - 16)) - anchor.left;
      setPanelPlacement({ left, below, height: Math.max(100, below ? bottomSpace : topSpace) });
    };
    placePanel();
    const observer = new ResizeObserver(placePanel);
    if (panelRef.current) observer.observe(panelRef.current);
    window.addEventListener("resize", placePanel);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placePanel);
    };
  }, [open, position]);

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const rect = event.currentTarget.getBoundingClientRect();
    suppressClick.current = false;
    dragRef.current = {
      id: event.pointerId,
      start: { x: event.clientX, y: event.clientY },
      origin: { x: rect.left, y: rect.top },
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.start.x;
    const dy = event.clientY - drag.start.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    setDragging(true);
    setOpen(false);
    setPosition(keepInView({ x: drag.origin.x + dx, y: drag.origin.y + dy }));
  };
  const endDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    suppressClick.current = drag.moved;
    if (drag.moved) {
      savePosition(
        keepInView({
          x: drag.origin.x + event.clientX - drag.start.x,
          y: drag.origin.y + event.clientY - drag.start.y,
        }),
      );
    }
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      className={styles.container}
      ref={containerRef}
      data-dragging={dragging}
      style={
        position ? { left: position.x, top: position.y, right: "auto", bottom: "auto" } : undefined
      }
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={() => {
          if (suppressClick.current) {
            suppressClick.current = false;
            return;
          }
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          const directions: Record<string, Position> = {
            ArrowLeft: { x: -16, y: 0 },
            ArrowRight: { x: 16, y: 0 },
            ArrowUp: { x: 0, y: -16 },
            ArrowDown: { x: 0, y: 16 },
          };
          const delta = directions[event.key];
          if (!delta) return;
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          const next = keepInView({ x: rect.left + delta.x, y: rect.top + delta.y });
          setPosition(next);
          savePosition(next);
        }}
        aria-expanded={open}
        aria-controls="music-pet-panel"
        aria-label={open ? "Close music companion" : "Open music companion"}
        aria-describedby="music-pet-instructions"
      >
        <MusicPetFace playing={data.status === "playing"} />
        <span ref={tooltipRef} className={styles.tooltip} style={tooltipPlacement}>
          Drag to move. Click for music.
        </span>
      </button>
      <span id="music-pet-instructions" className={styles.srOnly}>
        Drag to move, or use the arrow keys. Press Enter to open music.
      </span>
      <section
        ref={panelRef}
        id="music-pet-panel"
        className={styles.panel}
        data-open={open}
        aria-label="Music companion"
        aria-hidden={!open}
        inert={!open}
        style={{
          left: panelPlacement.left,
          right: "auto",
          top: panelPlacement.below ? "calc(100% + 12px)" : "auto",
          bottom: panelPlacement.below ? "auto" : "calc(100% + 12px)",
          maxHeight: panelPlacement.height,
          transformOrigin: `${Math.max(0, -panelPlacement.left)}px ${panelPlacement.below ? "top" : "bottom"}`,
        }}
      >
        <div className={styles.header}>
          <span>
            <FaSpotify aria-hidden="true" /> Spotify
          </span>
          <button
            type="button"
            className={styles.close}
            aria-label="Close music companion"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            <FiX size={17} aria-hidden="true" />
          </button>
        </div>
        <NowPlaying data={data} loading={loading} compact />
        <Link href="/music" className={styles.pageLink} onClick={() => setOpen(false)}>
          Music & playlists <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
