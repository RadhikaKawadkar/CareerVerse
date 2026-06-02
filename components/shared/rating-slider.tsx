"use client";

import { cn } from "@/lib/utils";

type RatingSliderProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  accent?: "sky" | "emerald";
};

export function RatingSlider({
  label,
  value,
  onChange,
  minLabel = "Not at all",
  maxLabel = "Very much",
  accent = "sky",
}: RatingSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <span
          className={cn(
            "font-[family-name:var(--font-plus-jakarta)] text-lg font-bold",
            accent === "sky" && "text-sky-600",
            accent === "emerald" && "text-emerald-600",
          )}
        >
          {value}/5
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full bg-muted",
          accent === "sky" &&
            "[&::-webkit-slider-thumb]:bg-sky-500 [&::-moz-range-thumb]:bg-sky-500",
          accent === "emerald" &&
            "[&::-webkit-slider-thumb]:bg-emerald-500 [&::-moz-range-thumb]:bg-emerald-500",
          "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md",
          "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
          "[&::-moz-range-thumb]:border-0",
        )}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
