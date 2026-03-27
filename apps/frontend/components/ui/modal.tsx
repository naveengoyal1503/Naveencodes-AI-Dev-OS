"use client";

import type { PropsWithChildren } from "react";

import { AppButton } from "./button";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/40">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <AppButton variant="ghost" onClick={onClose}>
            Close
          </AppButton>
        </div>
        <div className="mt-6 max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4">{children}</div>
      </div>
    </div>
  );
}
