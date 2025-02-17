
import { Tool } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { ColorPicker } from "./ColorPicker";
import { BrushSizeSelector } from "./BrushSizeSelector";
import type { BrushSize } from "./Canvas";

interface DrawingToolsProps {
  activeTool: Tool;
  activeColor: string;
  brushSize: BrushSize;
  onToolClick: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: BrushSize) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onImageUpload: () => void;
}

export const DrawingTools = ({
  activeTool,
  activeColor,
  brushSize,
  onToolClick,
  onColorChange,
  onBrushSizeChange,
  onClear,
  onUndo,
  onRedo,
  onImageUpload,
}: DrawingToolsProps) => {
  const showBrushSize = activeTool === "draw";

  return (
    <>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <div className="flex items-start gap-4">
          <Toolbar 
            activeTool={activeTool} 
            onToolClick={onToolClick} 
            onClear={onClear}
            onUndo={onUndo}
            onRedo={onRedo}
            onImageUpload={onImageUpload}
          />
          <BrushSizeSelector
            brushSize={brushSize}
            onBrushSizeChange={onBrushSizeChange}
            show={showBrushSize}
          />
        </div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <ColorPicker color={activeColor} onChange={onColorChange} />
      </div>
    </>
  );
};
