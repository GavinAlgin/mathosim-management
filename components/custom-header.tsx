'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FunnelIcon } from "lucide-react";

interface HeaderProps {
  totalItems: number;
  onSearch: (value: string) => void;
  onFilterClick: () => void;
}

export default function Header({ totalItems, onSearch, onFilterClick }: HeaderProps) {
  return (
    <header className="w-full px-4 py-3 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Total Items */}
        <div className="text-lg font-medium">
          Total Items: <span className="font-bold">{totalItems}</span>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search items..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button
            variant="outline"
            onClick={onFilterClick}
            className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>
    </header>
  );
}
