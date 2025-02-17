import { useEffect, useRef, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Canvas as FabricCanvas, Circle, Rect, Line, Path, IText, PencilBrush, Image as FabricImage, Polygon } from "fabric";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { DrawingTools } from "./DrawingTools";
import { BRUSH_SIZES } from "./BrushSizeSelector";

export type Tool = "select" | "draw" | "rectangle" | "circle" | "line" | "text" | "eraser" | "hexagon" | "triangle" | "diamond";
export type BrushSize = "S" | "M" | "L" | "XL";

type CanvasData = {
  id: string;
  name: string;
  preview_url: string;
  created_at: string;
  updated_at: string;
  json_data: string;
};

export const Canvas = () => {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [activeTool, setActiveTool] = useState<Tool>("draw");
  const [brushSize, setBrushSize] = useState<BrushSize>("S");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!canvasRef.current) return;

    const storedCanvases = JSON.parse(localStorage.getItem('canvases') || '[]');
    const canvasData = storedCanvases.find((c: CanvasData) => c.id === id);

    if (!canvasData) {
      toast.error("Canvas not found!");
      return;
    }

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#ffffff",
    });

    canvas.loadFromJSON(canvasData.json_data, () => {
      canvas.renderAll();
      toast("Canvas loaded!");
    });

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = BRUSH_SIZES[brushSize];

    const saveCanvasData = () => {
      const previewUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1,
        enableRetinaScaling: true
      });

      const updatedCanvases = storedCanvases.map((c: CanvasData) =>
        c.id === id ? { ...c, json_data: JSON.stringify(canvas), preview_url: previewUrl, updated_at: new Date().toISOString() } : c
      );
      localStorage.setItem('canvases', JSON.stringify(updatedCanvases));
    };

    canvas.on('selection:created', (e: any) => {
      const selectedObject = e.selected[0];
      if (selectedObject) {
        if (selectedObject.stroke) {
          setActiveColor(selectedObject.stroke);
        } else if (selectedObject.fill) {
          setActiveColor(selectedObject.fill);
        }
      }
    });

    canvas.on('selection:updated', (e: any) => {
      const selectedObject = e.selected[0];
      if (selectedObject) {
        if (selectedObject.stroke) {
          setActiveColor(selectedObject.stroke);
        } else if (selectedObject.fill) {
          setActiveColor(selectedObject.fill);
        }
      }
    });

    canvas.set('targetFindTolerance', 15);
    canvas.set('enableRetinaScaling', true);

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        activeObjects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    canvas.on('object:modified', saveCanvasData);
    canvas.on('object:added', saveCanvasData);
    canvas.on('object:removed', saveCanvasData);
    setFabricCanvas(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.off('object:modified', saveCanvasData);
      canvas.off('object:added', saveCanvasData);
      canvas.off('object:removed', saveCanvasData);
      canvas.dispose();
    };
  }, [id, isMobile]);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    fabricCanvas.selection = activeTool === "select";

    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0 && activeTool === "select") {
      activeObjects.forEach((obj) => {
        if (obj.type === 'path') {
          obj.set('stroke', activeColor);
        } else {
          obj.set('fill', activeColor);
        }
      });
      fabricCanvas.renderAll();
    }

    if (activeTool !== "select") {
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
    }

    if (fabricCanvas.freeDrawingBrush) {
      if (activeTool === "draw") {
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = BRUSH_SIZES[brushSize];
      }
    }

    switch (activeTool) {
      case "select":
        fabricCanvas.defaultCursor = "default";
        fabricCanvas.hoverCursor = "move";
        break;
      case "draw":
        fabricCanvas.defaultCursor = "crosshair";
        fabricCanvas.hoverCursor = "crosshair";
        break;
      case "eraser":
        fabricCanvas.defaultCursor = "crosshair";
        fabricCanvas.hoverCursor = "crosshair";
        break;
      default:
        fabricCanvas.defaultCursor = "crosshair";
        fabricCanvas.hoverCursor = "crosshair";
    }

    if (activeTool === "eraser") {
      // Define the eraser handler for mouse events
      const eraserHandler = (e: MouseEvent) => {
        const target = fabricCanvas.findTarget(e as any);
        if (target) {
          fabricCanvas.remove(target);
          fabricCanvas.renderAll();
        }
      };
  
      // Attach mouse down event to start erasing
      fabricCanvas.on('mouse:down', eraserHandler as any);
  
      // Attach mouse move event to continue erasing while moving
      fabricCanvas.on('mouse:move', eraserHandler as any);
  
      // Clean up the event listeners when the component unmounts or when the tool changes
      return () => {
        fabricCanvas.off('mouse:down', eraserHandler as any);
        fabricCanvas.off('mouse:move', eraserHandler as any);
      };
    }
  }, [activeTool, activeColor, brushSize, fabricCanvas]);

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 50,
        fill: activeColor,
        width: 100,
        height: 100,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 50,
        fill: activeColor,
        radius: 50,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === "line") {
      const line = new Line([50, 50, 200, 200], {
        left: fabricCanvas.width! / 2 - 75,
        top: fabricCanvas.height! / 2 - 75,
        stroke: activeColor,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(line);
      fabricCanvas.setActiveObject(line);
    } else if (tool === "text") {
      const text = new IText("Click to edit text", {
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 10,
        fontFamily: 'Arial',
        fontSize: BRUSH_SIZES[brushSize] * 4,
        fill: activeColor,
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
    } else if (tool === "hexagon") {
      const hexagon = new Polygon([
        { x: 50, y: 0 },
        { x: 100, y: 0 },
        { x: 125, y: 50 },
        { x: 100, y: 100 },
        { x: 50, y: 100 },
        { x: 25, y: 50 },
      ], {
        left: fabricCanvas.width! / 2 - 75,
        top: fabricCanvas.height! / 2 - 50,
        fill: activeColor,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(hexagon);
      fabricCanvas.setActiveObject(hexagon);
    } else if (tool === "triangle") {
      const triangle = new Polygon([
        { x: 50, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ], {
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 50,
        fill: activeColor,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(triangle);
      fabricCanvas.setActiveObject(triangle);
    } else if (tool === "diamond") {
      const diamond = new Polygon([
        { x: 50, y: 0 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 0, y: 50 },
      ], {
        left: fabricCanvas.width! / 2 - 50,
        top: fabricCanvas.height! / 2 - 50,
        fill: activeColor,
        strokeWidth: BRUSH_SIZES[brushSize],
      });
      fabricCanvas.add(diamond);
      fabricCanvas.setActiveObject(diamond);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared!");
  };

  const handleUndo = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      const removedObject = objects[objects.length - 1];
      undoStack.push(removedObject); // Store the removed object
      fabricCanvas.remove(removedObject);
      redoStack.push(removedObject); // Store in redo stack
      fabricCanvas.renderAll();
      toast("Undo!");
    }
  };
  
  const handleRedo = () => {
    if (!fabricCanvas || redoStack.length === 0) return;
    const restoredObject = redoStack.pop(); // Get last removed object
    fabricCanvas.add(restoredObject); // Add back to canvas
    undoStack.push(restoredObject); // Keep it in undo stack again
    fabricCanvas.renderAll();
    toast("Redo!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricCanvas || !e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) return;

      FabricImage.fromURL(event.target.result as string, {
        onload: (img) => {
          const canvasWidth = fabricCanvas.width!;
          const canvasHeight = fabricCanvas.height!;
          const scale = Math.min(
            (canvasWidth * 0.5) / img.width!,
            (canvasHeight * 0.5) / img.height!
          );

          img.scale(scale);
          img.set({
            left: (canvasWidth - img.width! * scale) / 2,
            top: (canvasHeight - img.height! * scale) / 2
          });

          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          fabricCanvas.renderAll();
          toast("Image uploaded!");
        }
      });
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50">
       {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')} // Navigate back to the dashboard
        className="absolute z-10 top-3 left-3 px-3 py-1 bg-white text-black rounded-md shadow-sm border border-gray-200"
      >
        Back
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
      <DrawingTools
        activeTool={activeTool}
        activeColor={activeColor}
        brushSize={brushSize}
        onToolClick={handleToolClick}
        onColorChange={setActiveColor}
        onBrushSizeChange={setBrushSize}
        onClear={handleClear}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onImageUpload={() => fileInputRef.current?.click()}
      />
      <canvas ref={canvasRef} className="w-full h-full touch-none" />
    </div>
  );
};
