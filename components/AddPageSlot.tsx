import { Button } from "./ui/button";
import { Plus } from "lucide-react";
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
      className={`h-9 flex items-center justify-center transition-all duration-200 ease-in-out ${
        showButton ? "w-8" : "w-2"
      }`}
    >
      {showButton && (
        <Button
          onClick={onAdd}
          variant="ghost"
          size="sm"
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-150 p-0 border-none shadow-none"
          aria-label="Add page"
          type="button"
        >
          <Plus size={12} strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}
