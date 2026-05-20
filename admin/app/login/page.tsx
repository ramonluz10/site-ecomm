"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const payload = await response.json()
        setError(payload.message || 'Falha na autenticação')
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-auth-shell">
      <section className="login-card">
        <h1>Login Administrativo</h1>
        <p>Autentique-se para gerenciar o painel empresarial.</p>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Usuário
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="admin" />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Senha secreta" />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
