"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { PRESETS } from "@/lib/preset";

interface AddLinkListViewProps {
  onSelect: (key: string) => void;
}

export default function AddLinkListView({ onSelect }: AddLinkListViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [fade, setFade] = useState(true);

  const categories = ["Social", "Dev", "Education", "Other"] as const;
  const categoryCounts = categories.map(
    (cat) => PRESETS.filter((p) => p.category === cat).length
  );

  const filteredPresets = PRESETS.filter(
    (preset) =>
      (!selectedCategory || preset.category === selectedCategory) &&
      preset.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setFade(false);
    const timeout = setTimeout(() => {
      setFade(true);
    }, 150);
    return () => clearTimeout(timeout);
  }, [selectedCategory, search]);

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="px-5 pt-4 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category */}
      <div className="px-5 pb-4 flex flex-wrap gap-2 border-b flex-shrink-0">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="text-xs"
        >
          All
          <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
            {PRESETS.length}
          </Badge>
        </Button>
        {categories.map((cat, idx) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="text-xs"
          >
            {cat}
            <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
              {categoryCounts[idx]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Link list */}
      <div
        className="flex-1 overflow-y-auto min-h-0 "
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className={`p-5 transition-opacity duration-150 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {filteredPresets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No platforms found
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredPresets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.key}
                    onClick={() => onSelect(preset.key)}
                    className="flex flex-col items-center gap-2 rounded-lg border p-3 hover:bg-accent transition"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
