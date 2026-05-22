'use client'

import { useState } from 'react'
import { useForm, UseFormProps, FieldValues, SubmitHandler } from 'react-hook-form'

export interface UseAdminFormOptions<T extends FieldValues> extends UseFormProps<T> {
  onSubmit?: SubmitHandler<T>
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useAdminForm<T extends FieldValues>(options: UseAdminFormOptions<T>) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<T>({
    mode: 'onBlur',
    ...options,
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      setError(null)
      setSubmitting(true)

      if (options.onSubmit) {
        await options.onSubmit(data)
      }

      if (options.onSuccess) {
        options.onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar formulário'
      setError(errorMessage)
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    error,
    submitting,
  }
}
