"use client";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

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
  ]);
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
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
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={pages.map((p) => p.id)}
        strategy={horizontalListSortingStrategy}
      >
        <nav
          className="flex gap-0 items-center p-4 bg-gray-50 rounded-lg"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AddPageSlot
            showButton={hoveredIndex === -1}
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
                showButton={hoveredIndex === idx}
                onHover={() => setHoveredIndex(idx)}
                onAdd={() => addPage(idx + 1)}
              />
            </React.Fragment>
          ))}
        </nav>
      </SortableContext>
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`px-4 py-2 rounded-md border shadow-sm transition-all duration-150 whitespace-nowrap ${
        active
          ? "bg-blue-600 text-white border-blue-700 shadow-md"
          : "bg-white hover:bg-gray-100 border-gray-200"
      }`}
      type="button"
    >
      {label}
    </button>
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
      className="relative h-10 w-4 flex items-center justify-center"
    >
      {showButton && (
        <button
          onClick={onAdd}
          className="absolute z-10 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold border-2 border-white shadow-md transition-all duration-150"
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
