import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, children, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    const onKey = e => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onMouseDown={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div ref={ref} tabIndex={-1} className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}


