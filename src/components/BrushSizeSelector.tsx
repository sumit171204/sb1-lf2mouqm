
import { BrushSize } from "./Canvas";

interface BrushSizeSelectorProps {
  brushSize: BrushSize;
  onBrushSizeChange: (size: BrushSize) => void;
  show: boolean;
}

const BRUSH_SIZES: Record<BrushSize, number> = {
  S: 2,
  M: 5,
  L: 10,
  XL: 20,
};

export const BrushSizeSelector = ({ brushSize, onBrushSizeChange, show }: BrushSizeSelectorProps) => {
  if (!show) return null;

  return (
    <div className="gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
      {(Object.keys(BRUSH_SIZES) as BrushSize[]).map((size) => (
        <button
          key={size}
          onClick={() => onBrushSizeChange(size)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
            brushSize === size 
              ? 'bg-purple-100 text-purple-900' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export { BRUSH_SIZES };
