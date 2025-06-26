"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface Page {
  id: string;
  label: string;
}

export default function PageMenu() {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", label: "Info" },
    { id: "2", label: "Details" },
    { id: "3", label: "Other" },
    { id: "4", label: "Ending" },
    { id: "5", label: "Add page" },
  ]);
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<Page | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const draggedItem = pages.find((p) => p.id === event.active.id);
    if (draggedItem) {
      setActiveItem(draggedItem);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    setActiveItem(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages((currentPages) => {
        const oldIndex = currentPages.findIndex((p) => p.id === active.id);
        const newIndex = currentPages.findIndex((p) => p.id === over.id);
        return arrayMove(currentPages, oldIndex, newIndex);
      });
    }
  }

  function addPage(index: number) {
    const newPage: Page = {
      id: Date.now().toString(),
      label: `Page ${pages.length + 1}`,
    };
    const updated = [...pages];
    updated.splice(index, 0, newPage);
    setPages(updated);
    setActivePageId(newPage.id);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map((p) => p.id)}
        strategy={horizontalListSortingStrategy}
      >
        <nav
          className="flex items-center p-2 bg-gray-100 rounded-lg"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AddPageSlot
            showButton={hoveredIndex === -1 && !isDragging}
            onHover={() => setHoveredIndex(-1)}
            onAdd={() => addPage(0)}
          />
          {pages.map((page, idx) => (
            <React.Fragment key={page.id}>
              <SortablePageItem
                id={page.id}
                label={page.label}
                active={activePageId === page.id}
                onClick={() => setActivePageId(page.id)}
              />
              <AddPageSlot
                showButton={hoveredIndex === idx && !isDragging}
                onHover={() => setHoveredIndex(idx)}
                onAdd={() => addPage(idx + 1)}
              />
            </React.Fragment>
          ))}
        </nav>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <SortablePageItem
            id={activeItem.id}
            label={activeItem.label}
            active={true}
            onClick={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortablePageItem({
  id,
  label,
  active,
  onClick,
}: {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
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
    </div>
  );
}

// A hoverable slot that shows an add button
function AddPageSlot({
  showButton,
  onHover,
  onAdd,
}: {
  showButton: boolean;
  onHover: () => void;
  onAdd: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      className="relative h-9 w-2 flex items-center justify-center"
    >
      {showButton && (
        <button
          onClick={onAdd}
          className="absolute z-10 w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white text-base font-bold border-2 border-white shadow-md transition-all duration-150"
          aria-label="Add page"
          type="button"
        >
          +
        </button>
      )}
    </div>
  );
}

/*
Are the info and the add page buttons on the menu also draggable?
*/
