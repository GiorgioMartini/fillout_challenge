"use client";
import { useState } from "react";

// Minimal Page type
interface Page {
  id: string;
  label: string;
}

export default function PageMenu() {
  const [pages] = useState<Page[]>([
    { id: "1", label: "Info" },
    { id: "2", label: "Details" },
    { id: "3", label: "Other" },
    { id: "4", label: "Ending" },
  ]);
  const [activePageId, setActivePageId] = useState<string>(pages[0].id);

  return (
    <nav className="flex gap-4">
      {pages.map((page) => (
        <button
          key={page.id}
          onClick={() => setActivePageId(page.id)}
          className={`px-3 py-1 rounded ${
            activePageId === page.id ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {page.label}
        </button>
      ))}
    </nav>
  );
}
