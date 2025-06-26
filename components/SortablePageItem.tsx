import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

interface SortablePageItemProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function SortablePageItem({
  id,
  label,
  active,
  onClick,
}: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center rounded-md transition-all duration-150 whitespace-nowrap mx-1 ${
        active ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <Button
        variant={active ? "default" : "secondary"}
        onClick={onClick}
        className={`flex-1 px-3 py-1.5 h-auto text-sm font-normal border-transparent shadow-none transition-all duration-150 whitespace-nowrap ${
          active
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-gray-100 text-gray-700"
        }`}
        type="button"
      >
        {label}
      </Button>
      {active && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto px-1 py-1 text-gray-500 hover:text-gray-900"
            >
              <span className="sr-only">Open menu</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="10" cy="4" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="10" cy="16" r="1.5" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuItem>Set as first page</DropdownMenuItem>
            <DropdownMenuItem>Rename</DropdownMenuItem>
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
