import { Button } from "@/components/ui/button";
import { MousePointer2, Pencil, Square, Circle, Trash2, Undo, Redo, Minus, Type, Eraser, Upload, Star, ChevronUp, ChevronDown, Hexagon, Triangle, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tool } from "./Canvas";
import { useState } from "react";

interface ToolbarProps {
  activeTool: Tool;
  onToolClick: (tool: Tool) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onImageUpload: () => void;
}

export const Toolbar = ({ activeTool, onToolClick, onClear, onUndo, onRedo, onImageUpload }: ToolbarProps) => {
  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);

  const handleToolClick = (tool: Tool) => {
    // If the selected tool isn't a shape tool, close the shape menu
    if (tool !== "select" && tool !== "draw" && tool !== "text" && tool !== "eraser") {
      setIsShapeMenuOpen(false); // Close the shape menu
    }
    onToolClick(tool);
  };

  const handleShapeClick = (shape: Tool) => {
    onToolClick(shape);
    setIsShapeMenuOpen(false); // Close the shape menu after selecting a shape
  };

  return (
    <div className="flex flex-col gap-1 p-2 bg-white rounded-lg shadow-sm border border-gray-100 w-[44px]">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToolClick("select")}
        className={cn(
          "h-8 w-8 transition-all",
          activeTool === "select" && "bg-purple-100 text-purple-900"
        )}
      >
        <MousePointer2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToolClick("draw")}
        className={cn(
          "h-8 w-8 transition-all",
          activeTool === "draw" && "bg-purple-100 text-purple-900"
        )}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToolClick("text")}
        className={cn(
          "h-8 w-8 transition-all",
          activeTool === "text" && "bg-purple-100 text-purple-900"
        )}
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleToolClick("eraser")}
        className={cn(
          "h-8 w-8 transition-all",
          activeTool === "eraser" && "bg-purple-100 text-purple-900"
        )}
      >
        <Eraser className="h-4 w-4" />
      </Button>

      {/* Shape Selector Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsShapeMenuOpen(!isShapeMenuOpen)}
        className={cn("h-8 w-8 transition-all", isShapeMenuOpen && "bg-purple-100 text-purple-900")}
      >
        <Star className="h-4 w-4" />
      </Button>

      {/* Shape Menu (Appears when Shape Selector is clicked) */}
      {isShapeMenuOpen && (
        <div className="absolute bg-white border rounded-lg shadow-lg p-2 mt-2 ml-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("rectangle")}
            className="h-8 w-8"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("circle")}
            className="h-8 w-8"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("line")}
            className={cn(
              "h-8 w-8 transition-all",
              activeTool === "line" && "bg-purple-100 text-purple-900"
            )}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("hexagon")}
            className="h-8 w-8"
          >
            <Hexagon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("triangle")}
            className="h-8 w-8"
          >
            <Triangle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleShapeClick("diamond")}
            className="h-8 w-8"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="h-px w-full bg-gray-200 my-1" />
      <Button
        variant="ghost"
        size="icon"
        onClick={onImageUpload}
        className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Upload className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onUndo}
        className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRedo}
        className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="h-8 w-8 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
