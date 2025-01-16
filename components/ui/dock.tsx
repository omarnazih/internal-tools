"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  children: React.ReactNode
}

interface DockIconProps {
  className?: string
  children: React.ReactNode
  href?: string
  onClick?: () => void
  mouseX?: any
  active?: boolean
}

function DockIcon({ className, children, href, onClick, mouseX, active }: DockIconProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    const distance = Math.abs(bounds.x + bounds.width / 2 - val)
    const maxDistance = bounds.width * 2
    return distance < maxDistance ? 1 - distance / maxDistance : 0
  })

  const scale = useSpring(useTransform(distance, [0, 1], [1, 1.3]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className={cn(
        "relative aspect-square h-12 w-12",
        "flex items-center justify-center",
        "rounded-2xl bg-background/50 shadow-sm backdrop-blur-xl dark:bg-background/50",
        "hover:cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

function Dock({ className, children }: DockProps) {
  const mouseX = useMotionValue(Infinity)

  return (
    <motion.div
      id="dock"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
        "flex h-16 items-end gap-4 px-4 py-2.5",
        "rounded-2xl bg-background/30 shadow-lg backdrop-blur-2xl dark:bg-background/30",
        "border border-border/50",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            mouseX,
          })
        }
        return child
      })}
    </motion.div>
  )
}

export { Dock, DockIcon } 