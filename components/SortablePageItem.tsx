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
  onItemHover?: () => void; // Add handler to clear AddPageSlot hover state
  onAdd?: () => void; // Handler for adding a new page (used when type === "add")
}

export function SortablePageItem({
  id,
  label,
  type,
  active,
  onClick,
  onItemHover,
  onAdd,
}: SortablePageItemProps) {
  // Disable dragging only for "add" type items
  const isAddType = type === "add";
  const isDragDisabled = isAddType;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isAddType ? "pointer" : "grab", // Different cursor for add type
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
      style={style}
      className={cn(
        // Base styles
        "flex items-center rounded-lg h-8 px-[10px] py-1 gap-2 select-none transition-all duration-150 whitespace-nowrap mx-1",
        "border border-solid",
        // State-based styles using data attributes and CSS classes
        {
          // Active state
          "bg-white border-[var(--border)] shadow-[var(--shadow-elevation-1)]":
            active,

          // Inactive states
          "bg-background-muted border-border": !active && !hover,
          "bg-background-hover-strong border-border": !active && hover,

          // Focus styles (only for inactive items)
          "focus-visible:ring-4 focus-visible:ring-[#D1E9FF] focus-visible:border-ring focus-visible:z-10":
            !active,
        }
      )}
      {...(!isAddType ? listeners : {})} // No drag listeners for add type items
      {...(!isAddType ? attributes : {})} // No drag attributes for add type items
      onMouseEnter={() => {
        setHover(true);
        onItemHover?.(); // Clear AddPageSlot hover state when entering an item
      }}
      onMouseLeave={() => setHover(false)}
      onClick={isAddType ? onAdd : onClick} // Use onAdd for add type items
    >
      <IconComponent
        size={20}
        style={{
          color: hover && !active ? "var(--icon-hover)" : "var(--icon-accent)",
          // Ensure icon maintains exact size during dragging/transforms
          width: 20,
          height: 20,
          flexShrink: 0,
        }}
      />
      <Button
        variant={"ghost"}
        onClick={isAddType ? onAdd : onClick} // Use onAdd for add type items
        className={`px-0 py-0 h-8 min-w-0 text-[14px] font-medium leading-[1.43] tracking-[-0.015em] bg-transparent shadow-none border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none`}
        type="button"
        tabIndex={-1}
        style={{
          color: hover && !active ? "var(--text-hover)" : "var(--text-strong)",
        }}
      >
        {label}
      </Button>
      {active &&
        !isAddType && ( // Don't show settings menu for add type items
          <PageItemSettingsMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto px-1 py-1 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the item click
              }}
            >
              <MoreVertical size={16} />
            </Button>
          </PageItemSettingsMenu>
        )}
    </div>
  );
}
