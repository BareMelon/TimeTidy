import { ReactNode } from 'react'
import { ToastContainer, useToast } from '@/components/Toast'

export function ToastWrapper({ children }: { children: ReactNode }) {
  const { toasts, removeToast } = useToast()
  
  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
} 