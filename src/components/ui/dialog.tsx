import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export const DialogContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[60] animate-[fade-in_0.2s_ease-out] bg-black/70 backdrop-blur-md" />
    <div className="pointer-events-none fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'pointer-events-auto relative max-h-[92vh] w-full animate-[dialog-in_0.28s_cubic-bezier(0.2,0.8,0.2,1)] overflow-y-auto rounded-t-[2.5rem] border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0a1128] text-slate-900 dark:text-white shadow-lift outline-none sm:max-w-2xl sm:rounded-[2.5rem]',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Đóng"
          className="absolute right-5 top-5 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </div>
  </DialogPrimitive.Portal>
))
DialogContent.displayName = 'DialogContent'
