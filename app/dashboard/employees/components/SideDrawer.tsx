'use client';

import { ReactNode, useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

interface SideDrawerProps {
  /** Controls visibility */
  open: boolean;
  /** Called when drawer should close */
  onClose: () => void;
  /** Drawer title */
  title?: string;
  /** Drawer content */
  children: ReactNode;
  /** Tailwind width class (default: max-w-md) */
  width?: string;
  /** Disable closing on overlay click */
  disableOverlayClose?: boolean;
}

export function SideDrawer({
  open,
  onClose,
  title,
  children,
  width = "max-w-md",
  disableOverlayClose = false,
}: SideDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  /** Close on ESC */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          if (!disableOverlayClose) onClose();
        }}
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        className={`
          fixed right-0 top-0 z-50 h-full w-full ${width}
          bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          translate-x-0
        `}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b px-5 py-4">
          {title && (
            <h2 className="text-lg font-semibold">{title}</h2>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <IconX size={20} />
          </button>
        </header>

        {/* Content */}
        <section className="h-[calc(100%-64px)] overflow-y-auto">
          {children}
        </section>
      </aside>
    </>
  );
}
