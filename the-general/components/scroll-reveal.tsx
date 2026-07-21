"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

const FLUID_EASE = [0.32, 0.72, 0, 1] as const;

export function ScrollReveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: FLUID_EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
