'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
  helperText?: string
  registration: UseFormRegisterReturn
  required?: boolean
}

export function FormInput({
  label,
  error,
  helperText,
  registration,
  required,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <Label className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}>
          {label}
        </Label>
      )}
      <Input
        {...registration}
        {...props}
        className={cn(error && 'border-red-500 focus-visible:ring-red-500', className)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  )
}
