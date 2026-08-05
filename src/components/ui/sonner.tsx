"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[#0A0A0C] group-[.toaster]:text-[#F5F5F7] group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl",
          description: "group-[.toast]:text-stone",
          actionButton:
            "group-[.toast]:bg-chrome group-[.toast]:text-black",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-stone",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
