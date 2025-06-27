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
import {
  FileText,
  Info,
  CheckCircle,
  Plus,
  Flag,
  Pencil,
  Copy,
  Layers,
  Trash2,
} from "lucide-react";
import { cn } from "../lib/utils";

interface SortablePageItemProps {
  id: string;
  label: string;
  type: string;
  active: boolean;
  onClick: () => void;
  index: number;
  total: number;
}

export function SortablePageItem({
  id,
  label,
  type,
  active,
  onClick,
  index,
  total,
}: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: index === 0 || index === total - 1 });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    opacity: isDragging ? 0 : 1,
  };

  const [hover, setHover] = React.useState(false);

  // Icon selection logic
  let IconComponent = FileText;
  if (type === "info") IconComponent = Info;
  else if (type === "ending") IconComponent = CheckCircle;
  else if (type === "add") IconComponent = Plus;

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
          "bg-background-muted": !active && !hover,
          "bg-background-hover-strong": !active && hover,
          "border-transparent": active,
          "border-border": !active,
          "focus-visible:ring-4 focus-visible:ring-[#D1E9FF] focus-visible:border-ring focus-visible:z-10":
            !active,
        }
      )}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <IconComponent
        size={20}
        style={{
          color: hover && !active ? "var(--icon-hover)" : "var(--icon-accent)",
        }}
      />
      <Button
        variant={"ghost"}
        onClick={onClick}
        className={`px-0 py-0 h-8 min-w-0 text-[14px] font-medium leading-[1.43] tracking-[-0.015em] bg-transparent shadow-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
        type="button"
        tabIndex={-1}
        style={{
          color: hover && !active ? "var(--text-hover)" : "var(--text-strong)",
        }}
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
          <DropdownMenuContent
            align="end"
            className="w-48"
            style={{
              borderRadius: "12px",
              padding: "0",
              boxShadow: "var(--shadow-elevation-1)",
              border: "0.5px solid var(--border)",
            }}
          >
            <DropdownMenuLabel
              style={{
                padding: "12px",
                background: "#FAFBFC",
                borderBottom: "0.5px solid var(--border)",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                fontWeight: 500,
                fontSize: "16px",
                color: "var(--text-strong)",
              }}
            >
              Settings
            </DropdownMenuLabel>
            <div style={{ padding: "12px" }}>
              <DropdownMenuItem className="flex items-center gap-2">
                <Flag size={16} color="var(--ring)" />
                <span>Set as first page</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Pencil size={16} color="var(--icon-secondary)" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Copy size={16} color="var(--icon-secondary)" />
                <span>Copy</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Layers size={16} color="var(--icon-secondary)" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="flex items-center gap-2 text-[var(--destructive-danger)]"
              >
                <Trash2 size={16} color="var(--destructive-danger)" />
                <span>Delete</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
