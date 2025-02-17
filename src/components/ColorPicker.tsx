
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const colors = [
  "#000000", // Black
  "#ea384c", // Red
  "#F97316", // Orange
  "#0EA5E9", // Blue
  "#8B5CF6", // Purple
  "#D946EF", // Pink
  "#22C55E", // Green (Added)
  "#fff",    // White
];

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-[44px]">
      {colors.map((c) => (
        <Button
          key={c}
          variant="ghost"
          size="icon"
          onClick={() => onChange(c)}
          className={cn(
            "h-6 w-6 rounded-full p-0 transition-all",
            color === c && "ring-2 ring-purple-500 ring-offset-1"
          )}
        >
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: c }}
          />
        </Button>
      ))}
    </div>
  );
};
