"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  MoreVertical,
  FileText,
  Table,
  PackageOpen,
  Users,
} from "lucide-react";

type FileItem = {
  title: string;
  size: string;
  type: "Word Document" | "Spreadsheet" | "Project File" | "Team File";
  icon: React.ElementType;
};

const files: FileItem[] = [
  { title: "Marketing Plan", size: "1.2 MB", type: "Word Document", icon: FileText },
  { title: "Budget Q3", size: "850 KB", type: "Spreadsheet", icon: Table },
  { title: "Redesign Sprint", size: "3.1 MB", type: "Project File", icon: PackageOpen },
  { title: "Team Notes", size: "600 KB", type: "Team File", icon: Users },
];

export default function RecentlyModified() {
  return (
    <section>
      <div className="flex gap-4 overflow-x-auto">
        {files.map((file, idx) => {
          const Icon = file.icon;

          return (
            <Card key={idx} className="relative w-56 p-4 flex-shrink-0">
              {/* Dropdown Menu */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <MoreVertical className="w-4 h-4 text-gray-600 hover:text-black" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Open</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* File Info */}
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium">{file.title}</p>
                  <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
