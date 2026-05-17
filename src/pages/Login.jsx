import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        if (!email.trim() || !password.trim()) {
        setError('Email dan password wajib diisi')
        return
        }

        setLoading(true)
        setError(null)

        try {
        const res = await fetch('https://finprosbdkel16backend-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.msg)
            return
        }

        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        navigate('/')
        } catch (err) {
        setError('Terjadi kesalahan, coba lagi')
        } finally {
        setLoading(false)
        }
    }

    return (
        <div className="auth-page">
        <div className="auth-card">
            <h1 className="auth-title">EchoDrop</h1>
            <p className="auth-subtitle">Where anonymous hearts leave their soundtrack</p>

            {error && <p className="auth-error">{error}</p>}

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="auth-input"
            />

            <button
            className="auth-btn"
            onClick={handleLogin}
            disabled={loading}
            >
            {loading ? 'Loading...' : 'Login'}
            </button>

            <p className="auth-switch">
            Belum punya akun? <Link to="/register">Register</Link>
            </p>
        </div>
        </div>
    )
}