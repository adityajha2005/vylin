"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export const MovingLogoCloud = ({
  items,
  speed = "normal",
  direction = "left",
  className,
}: {
  items: {
    name: string;
    logo: React.ReactNode;
  }[];
  speed?: "fast" | "normal" | "slow";
  direction?: "left" | "right";
  className?: string;
}) => {
  const duration =
    speed === "fast" ? 20 : speed === "normal" ? 40 : 80;

  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-8 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <motion.div
        className="flex min-w-full shrink-0 gap-16 w-max flex-nowrap"
        animate={{
          x: direction === "left" ? "-50%" : "0%",
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedItems.map((item, idx) => (
          <div
            className="flex-shrink-0"
            style={{
              width: "100px",
            }}
            key={`${item.name}-${idx}`}
          >
            {item.logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
