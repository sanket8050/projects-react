import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@shadcn/ui'

export default function Modal({ isOpen, onClose, title, description, children }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}