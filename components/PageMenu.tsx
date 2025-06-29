"use client";
import { useState, useEffect, useRef } from "react";
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
  type: string;
}

export default function PageMenu() {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", label: "Info", type: "info" },
    { id: "2", label: "Details", type: "details" },
    { id: "3", label: "Other", type: "details" },
    { id: "4", label: "Ending", type: "ending" },
    { id: "5", label: "Add page", type: "add" },
  ]);
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<Page | null>(null);
  const [isClient, setIsClient] = useState(false);
  const nextPageId = useRef(pages.length + 1);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        let newIndex = currentPages.findIndex((p) => p.id === over.id);

        // Ensure "Info" item always remains the first item
        // Don't allow any item to be moved to position 0
        if (newIndex === 0) {
          newIndex = 1; // Place just after the "Info" item
        }

        // Ensure "Add page" button always remains the last item
        // Don't allow any item to be moved past the second-to-last position
        const addPageIndex = currentPages.findIndex((p) => p.type === "add");
        if (newIndex >= addPageIndex) {
          newIndex = addPageIndex - 1; // Place just before the "Add page" button
        }

        return arrayMove(currentPages, oldIndex, newIndex);
      });
    }
  }

  function addPage(index: number) {
    const newId = nextPageId.current;
    const newPage: Page = {
      id: newId.toString(),
      label: `Page ${newId}`,
      type: "details",
    };
    nextPageId.current++;
    const updated = [...pages];
    updated.splice(index, 0, newPage);
    setPages(updated);
    setActivePageId(newPage.id);
  }

  if (!isClient) {
    return null;
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
          className="flex items-center p-2 bg-background rounded-lg"
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
                type={page.type}
                active={activePageId === page.id}
                onClick={() => setActivePageId(page.id)}
                index={idx}
                total={pages.length}
                onItemHover={() => setHoveredIndex(null)} // Clear AddPageSlot hover when entering an item
                onAdd={
                  page.type === "add"
                    ? () => addPage(pages.length - 1)
                    : undefined
                } // Add page before the "Add page" button
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
            type={activeItem.type}
            active={activePageId === activeItem.id}
            onClick={() => {}}
            index={pages.findIndex((p) => p.id === activeItem.id)}
            total={pages.length}
            onAdd={
              activeItem.type === "add"
                ? () => addPage(pages.length - 1)
                : undefined
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
