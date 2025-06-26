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
import { FileText } from "lucide-react";
import { cn } from "../lib/utils";

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
      style={{
        ...style,
        boxShadow: active ? "var(--shadow-elevation-1)" : undefined,
        borderWidth: active ? 0.5 : undefined,
        borderStyle: active ? "solid" : undefined,
        borderColor: active ? "var(--border)" : undefined,
      }}
      className={cn(
        "flex items-center rounded-lg h-8 px-[10px] py-1 gap-2 select-none transition-all duration-150 whitespace-nowrap mx-1",
        {
          "bg-white": active,
          "bg-background-muted": !active,
          "border-transparent": active,
          "border-border": !active,
          "hover:bg-background-hover": !active,
          "focus-visible:ring-4 focus-visible:ring-[#D1E9FF] focus-visible:border-ring focus-visible:z-10":
            !active,
        }
      )}
      {...listeners}
      {...attributes}
    >
      <FileText size={20} style={{ color: "var(--icon-accent)" }} />
      <Button
        variant={"ghost"}
        onClick={onClick}
        className={`px-0 py-0 h-8 min-w-0 text-[14px] font-medium leading-[1.43] tracking-[-0.015em] bg-transparent shadow-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
        type="button"
        tabIndex={-1}
        style={{ color: "var(--text-strong)" }}
      >
        {label}
      </Button>
      {active && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto px-1 py-1 text-muted-foreground hover:text-foreground"
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
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
