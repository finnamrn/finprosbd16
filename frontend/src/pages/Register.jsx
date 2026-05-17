import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleRegister() {
        if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Semua field wajib diisi')
        return
        }

        setLoading(true)
        setError(null)

        try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.msg)
            return
        }

        navigate('/login')
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
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="auth-input"
            />
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
            onKeyDown={e => e.key === 'Enter' && handleRegister()}
            className="auth-input"
            />

            <button
            className="auth-btn"
            onClick={handleRegister}
            disabled={loading}
            >
            {loading ? 'Loading...' : 'Register'}
            </button>

            <p className="auth-switch">
            Sudah punya akun? <Link to="/login">Login</Link>
            </p>
        </div>
        </div>
    )
}