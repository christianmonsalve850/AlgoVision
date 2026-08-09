"react";

import { ReactNode, useState, useRef } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CanvasProps {
  /** The core visualizer component to render inside the canvas viewport */
  children: ReactNode;
  /** Optional title shown in the top toolbar (e.g. "Array Visualizer") */
  title?: string;
  /** Optional current step description or subtitle */
  subtitle?: string;
  /** Custom extra actions or badges to render on the right side of the toolbar */
  headerActions?: ReactNode;
  className?: string;
}

export function Canvas({
  children,
  title = "Visualization",
  subtitle,
  headerActions,
  className = "",
}: CanvasProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;

    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={canvasRef}
      className={`relative flex flex-col h-full w-full overflow-hidden rounded-xl border border-border/80 bg-zinc-950 shadow-sm ${
        isFullscreen ? "p-0 rounded-none border-none" : ""
      } ${className}`}
    >
      {/* CANVAS TOOLBAR */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 bg-zinc-900/50 px-4 py-2.5 backdrop-blur-xs select-none">
        {/* TITLE & METADATA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            <h2 className="font-mono text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              {title}
            </h2>
          </div>

          {subtitle && (
            <>
              <span className="text-zinc-700">|</span>
              <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                {subtitle}
              </span>
            </>
          )}
        </div>

        {/* TOOLBAR CONTROLS */}
        <div className="flex items-center gap-2">
          {headerActions}

          {headerActions && <span className="text-zinc-800">|</span>}

          {/* ZOOM CONTROLS */}
          <div className="flex items-center rounded-md border border-border/60 bg-zinc-900/80 p-0.5 text-zinc-400">
            <button
              onClick={handleZoomOut}
              className="rounded p-1 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              title="Zoom Out"
              type="button"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-1.5 font-mono text-[10px] hover:text-zinc-200 transition-colors"
              title="Reset Zoom"
              type="button"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="rounded p-1 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              title="Zoom In"
              type="button"
            >
              <ZoomIn className="size-3.5" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={handleResetZoom}
                className="rounded p-1 text-purple-400 hover:bg-zinc-800 transition-colors"
                title="Reset Scale"
                type="button"
              >
                <RotateCcw className="size-3" />
              </button>
            )}
          </div>

          {/* FULLSCREEN TOGGLE */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-md border border-border/60 bg-zinc-900/80 p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* VIEWPORT CANVAS WORKSPACE */}
      <div className="relative flex-1 w-full h-full overflow-auto p-6 flex items-center justify-center bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div
          className="transition-transform duration-200 ease-out flex items-center justify-center min-w-full min-h-full"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}