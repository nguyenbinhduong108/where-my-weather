"use client";

import React, { useEffect, useState, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  onMonthSelect?: (startDate: string, endDate: string) => void;
};

export default function WeatherDrawer({ open, onClose, title, children, onMonthSelect }: Props) {
  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Internal mount/visible state to sequence animations:
  // 1) mount container/backdrop
  // 2) after small delay, set visible=true so aside slides in
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);
  const startXRef = useRef<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      // mount immediately
      setMounted(true);
      // then on next frame (or small delay) trigger slide-in
      timeoutRef.current = window.setTimeout(() => setVisible(true), 80);
    } else {
      // trigger slide-out
      setVisible(false);
      // unmount after animation duration
      timeoutRef.current = window.setTimeout(() => setMounted(false), 750);
    }

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div aria-hidden={!open} className={`fixed inset-0`} style={{ zIndex: 2147483647 }}>
      {/* backdrop */}
      <div
        onClick={() => onClose()}
        className={`absolute inset-0  transition-opacity duration-700 ${mounted ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: 'rgba(0,0,0,0.45)', opacity: 1 - Math.min(1, dragOffset / (asideRef.current?.offsetWidth || window.innerWidth)) }}
      />

      {/* drawer panel */}
      <aside
        ref={asideRef as any}
        role="dialog"
        aria-modal="true"
        onPointerDown={(e) => {
          // start tracking drag
          // only start drag if press happens inside the aside area
          startXRef.current = e.clientX;
          setDragging(true);
          // capture pointer so we continue to receive move/up
          try { (e.target as Element).setPointerCapture?.(e.pointerId); } catch {}
        }}
        onPointerMove={(e) => {
          if (!dragging) return;
          const delta = e.clientX - startXRef.current;
          // only consider rightward drags
          setDragOffset(Math.max(0, delta));
        }}
        onPointerUp={(e) => {
          if (!dragging) return;
          setDragging(false);
          const width = asideRef.current?.getBoundingClientRect().width || window.innerWidth;
          const shouldClose = dragOffset > Math.min(200, width * 0.35);
          setDragOffset(0);
          if (shouldClose) onClose();
        }}
        onPointerCancel={() => {
          setDragging(false);
          setDragOffset(0);
        }}
        className={`fixed top-0 right-0 h-full w-full sm:w-4/5 md:w-1/2 min-w-[500px] max-w-[700px] bg-black/40 shadow-2xl transform flex flex-col`}
        style={{
          zIndex: 2147483648,
          willChange: 'transform, opacity',
          // compute transform: if not visible -> offscreen (100%), else translate by dragOffset px to the right
          transform: visible ? `translateX(${Math.min(100, (dragOffset / (asideRef.current?.offsetWidth || window.innerWidth)) * 100)}%)` : 'translateX(100%)',
          transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(.2,.8,.2,1)'
        }}
      >
        <header className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title || "Weather"}</h3>
          </div>
          <div className=" sm:hidden">
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 rounded text-black">Close</button>
          </div>
        </header>

        {/* month picker (select) */}
        <div className="p-4  flex items-center gap-4 rounded flex-wrap">
          <label className="text-lg font-medium text-white">Month</label>
          <select
            className="w-44 sm:w-48 px-3 py-2 rounded bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            defaultValue=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              const monthIndex = parseInt(val, 10);
              if (Number.isNaN(monthIndex)) return;
              if (!onMonthSelect) return;

              const year = 2025;
              const start = new Date(year, monthIndex, 1);
              const now = new Date();
              const maxDate = new Date(2025, 8, 20); // 2025-09-20
              let end: Date;
              if (monthIndex < now.getMonth() || now.getFullYear() > year) {
                end = new Date(year, monthIndex + 1, 0);
              } else {
                end = new Date(Math.min(now.getTime(), maxDate.getTime()));
              }

              const minDate = new Date(2025, 0, 1);
              if (start < minDate) start.setTime(minDate.getTime());
              if (end < minDate) end.setTime(minDate.getTime());
              if (start > maxDate) start.setTime(maxDate.getTime());
              if (end > maxDate) end.setTime(maxDate.getTime());

              import('@/utils').then((mod) => {
                const fmt = mod.formatDate;
                onMonthSelect(fmt(start), fmt(end));
              });
            }}
          >
            <option value="">Select month</option>
            {Array.from({ length: 12 }).map((_, idx) => {
              const monthLabel = new Date(2025, idx, 1).toLocaleString('en-US', { month: 'short' });
              const disabled = idx > 8; // after Sep 2025
              return (
                <option key={idx} value={String(idx)} disabled={disabled}>
                  {monthLabel} 2025{disabled ? ' (disabled)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div className="p-4 overflow-auto flex-1 no-scrollbar">{children}</div>
      </aside>
    </div>
  );
}
