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
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { SortablePageItem } from "./SortablePageItem";
import { AddPageSlot } from "./AddPageSlot";

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
          className="flex items-center p-2 bg-gray-50 rounded-lg"
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

/*
Are the info and the add page buttons on the menu also draggable?
*/
