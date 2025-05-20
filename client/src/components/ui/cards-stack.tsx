import React, { ReactNode } from "react";
import { motion, AnimatePresence, MotionProps, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface CardsStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode[];
  className?: string;
  onVote?: (direction: "left" | "right") => void;
  disableGesture?: boolean;
  showLabel?: boolean;
}

const CardsStack = ({
  children,
  className,
  disableGesture = false,
  onVote,
  showLabel = true,
  ...props
}: CardsStackProps) => {
  const [index, setIndex] = React.useState(0);
  const prevIndex = React.useRef(0);
  const [exitX, setExitX] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState<"left" | "right" | null>(null);

  const childrenWithKeys = React.Children.map(children, (child, i) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { key: i });
    }
    return child;
  });

  const activeChild = childrenWithKeys[index];
  const nextChild = childrenWithKeys[index + 1];

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (
      disableGesture ||
      Math.abs(info.offset.x) < 100 ||
      Math.abs(info.point.x) < 100
    ) {
      return;
    }

    if (info.offset.x > 0) {
      handleVote("right");
    } else {
      handleVote("left");
    }
  };

  const handleVote = React.useCallback(
    (vote: "left" | "right") => {
      setExitX(vote === "left" ? -200 : 200);
      setDirection(vote);
      prevIndex.current = index;
      onVote?.(vote);

      // Move to the next child after a short delay
      setTimeout(() => {
        setIndex((prev) => Math.min(prev + 1, children.length - 1));
        setExitX(null);
        setDirection(null);
      }, 300);
    },
    [index, children.length, onVote]
  );

  const hasPrevChild = prevIndex.current < index;

  return (
    <div
      className={cn(
        "relative w-full aspect-[5/7] md:aspect-[4/5]",
        className
      )}
      {...props}
    >
      {/* Background cards - used to create a 3D effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[80%] h-[80%] bg-muted rounded-2xl shadow-md -rotate-6 opacity-40"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[85%] h-[85%] bg-muted rounded-2xl shadow-md rotate-3 opacity-60"></div>
      </div>

      {/* Direction labels */}
      {showLabel && direction && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          {direction === "right" ? (
            <div className="text-2xl font-bold text-green-500 tracking-wider border-2 border-green-500 rounded-md px-6 py-2 bg-white/30 backdrop-blur-sm transform -rotate-12">
              LIKE
            </div>
          ) : (
            <div className="text-2xl font-bold text-red-500 tracking-wider border-2 border-red-500 rounded-md px-6 py-2 bg-white/30 backdrop-blur-sm transform rotate-12">
              SKIP
            </div>
          )}
        </div>
      )}

      {/* Main card - current */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
          drag={!disableGesture}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.9}
          onDragEnd={handleDragEnd}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{
            x: exitX || 0,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3 },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            opacity: { duration: 0.2 },
          }}
          whileDrag={{ scale: 0.98, opacity: 0.95 }}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-[90%] h-[90%] bg-white dark:bg-slate-900 shadow-xl rounded-2xl overflow-hidden">
            {activeChild}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-6 z-40">
        <button
          className="bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center text-red-500 hover:scale-110 transform transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={() => handleVote("left")}
          disabled={index === children.length - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <button
          className="bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center text-green-500 hover:scale-110 transform transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={() => handleVote("right")}
          disabled={index === children.length - 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-heart"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {/* Card counter */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-40">
        {index + 1}/{children.length}
      </div>
    </div>
  );
};

export { CardsStack };