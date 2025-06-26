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

  // Configure the pointer sensor to have a small activation delay, allowing onClick to fire
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
        <nav className="flex gap-2 items-center">
          <AddButton onClick={() => addPage(0)} />
          {pages.map((page, idx) => (
            <React.Fragment key={page.id}>
              <SortablePageItem
                id={page.id}
                label={page.label}
                active={activePageId === page.id}
                onClick={() => {
                  setActivePageId(page.id);
                }}
              />
              <AddButton onClick={() => addPage(idx + 1)} />
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
      className={`px-3 py-1 rounded border shadow-sm transition-colors duration-150 ${
        active ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
      }`}
      type="button"
    >
      {label}
    </button>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-200 text-blue-600 text-lg font-bold border border-gray-300 transition-colors duration-150"
      aria-label="Add page"
      type="button"
    >
      +
    </button>
  );
}
