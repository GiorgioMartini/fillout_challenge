import { Button } from "./ui/button";
import React from "react";

interface AddPageSlotProps {
  showButton: boolean;
  onHover: () => void;
  onAdd: () => void;
}

export function AddPageSlot({ showButton, onHover, onAdd }: AddPageSlotProps) {
  return (
    <div
      onMouseEnter={onHover}
      className="relative h-9 w-2 flex items-center justify-center"
    >
      {showButton && (
        <Button
          onClick={onAdd}
          variant="secondary"
          size="sm"
          className="absolute z-10 w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white text-base font-bold border-2 border-white shadow-md transition-all duration-150 p-0"
          aria-label="Add page"
          type="button"
        >
          +
        </Button>
      )}
    </div>
  );
}
