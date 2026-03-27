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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-950/40 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <AppButton variant="ghost" onClick={onClose} className="w-full justify-center sm:w-auto">
            Close
          </AppButton>
        </div>
        <div className="mt-6 max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4">{children}</div>
      </div>
    </div>
  );
}
