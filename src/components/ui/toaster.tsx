"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 border border-bone/15 bg-surface px-4 py-3 font-sans text-sm text-bone shadow-panel",
          title: "font-semibold",
          description: "text-mute",
          success: "[&_[data-icon]]:text-ok",
          error: "[&_[data-icon]]:text-danger",
          closeButton: "!left-auto !right-2 !top-2 !border-bone/20 !bg-surface !text-bone hover:!bg-lime hover:!text-ink",
        },
      }}
    />
  );
}
