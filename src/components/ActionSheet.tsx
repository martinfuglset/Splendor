import type { ReactNode } from 'react'
import clsx from 'clsx'

interface ActionSheetProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export const ActionSheet = ({ title, isOpen, onClose, children, footer }: ActionSheetProps) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 px-4 pb-4 pt-16">
      <button
        type="button"
        aria-label="Close action sheet"
        className="absolute inset-0 z-0 h-full w-full cursor-pointer"
        onClick={onClose}
      />
      <div
        className={clsx(
          'relative z-10 w-full max-w-md rounded-3xl bg-board-card text-slate-100 shadow-2xl',
          'max-h-[90vh] overflow-hidden border border-white/10',
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            type="button"
            className="text-sm uppercase tracking-wide text-slate-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-5 pb-5 text-sm">{children}</div>
        {footer && <div className="border-t border-white/5 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
