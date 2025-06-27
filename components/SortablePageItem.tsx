import { Button } from "./ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { FileText, Info, CheckCircle, Plus, MoreVertical } from "lucide-react";
import { cn } from "../lib/utils";
import { PageItemSettingsMenu } from "./PageItemSettingsMenu";

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

  const itemComponent = (
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
      onClick={!active ? onClick : undefined}
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
        <div className="h-auto px-1 py-1 text-muted-foreground">
          <MoreVertical size={16} />
        </div>
      )}
    </div>
  );

  // Wrap with settings menu only when active
  if (active) {
    return <PageItemSettingsMenu>{itemComponent}</PageItemSettingsMenu>;
  }

  return itemComponent;
}
