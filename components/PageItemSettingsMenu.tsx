import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Flag, Pencil, Copy, Layers, Trash2 } from "lucide-react";

interface PageItemSettingsMenuProps {
  children: React.ReactNode; // The trigger element
}

export function PageItemSettingsMenu({ children }: PageItemSettingsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
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
  );
}
