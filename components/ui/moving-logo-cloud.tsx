"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const MovingLogoCloud = ({
  items,
  speed = "slow",
  direction = "left",
  pauseOnHover = true,
  className,
}: {
  items: {
    name: string;
    logo: React.ReactNode;
  }[];
  speed?: "fast" | "normal" | "slow";
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const [duplicatedItems, setDuplicatedItems] = useState(items);

  useEffect(() => {
    // Duplicate items enough times to ensure smooth scrolling
    setDuplicatedItems([...items, ...items, ...items, ...items]);
  }, [items]);

  const getDuration = () => {
    switch (speed) {
      case "fast":
        return "20s";
      case "normal":
        return "40s";
      default:
        return "80s";
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-10 select-none [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <style jsx global>{`
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.5rem));
          }
        }
        .animate-scroll {
          animation: scroll var(--duration) linear infinite;
          animation-direction: var(--direction);
        }
      `}</style>

      <div
        className={cn(
          "flex min-w-full shrink-0 gap-12 w-max flex-nowrap animate-scroll items-center",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={
          {
            "--duration": getDuration(),
            "--direction": direction === "left" ? "normal" : "reverse",
          } as React.CSSProperties
        }
      >
        {duplicatedItems.map((item, idx) => (
          <div
            className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
            key={`${item.name}-${idx}`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 rounded-full" />
            
            <div className="relative opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0">
              {item.logo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
