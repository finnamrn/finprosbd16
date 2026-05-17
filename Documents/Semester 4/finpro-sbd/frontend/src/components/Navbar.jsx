import { useNavigate } from 'react-router-dom'

export default function Navbar({ onSearch }) {
    const navigate = useNavigate()
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('spotify_token')
        navigate('/')
    }

    return (
        <nav className="navbar">
        <button className="nav-icon" onClick={() => navigate('/')}>
            <img src="/arrow.png" alt="back" />
        </button>

        <div className="search-bar">
            <img src="/search.png" alt="search" />
            <input
            type="text"
            placeholder="Search for a name"
            onChange={e => onSearch && onSearch(e.target.value)}
            />
        </div>

        {token ? (
            <div className="nav-auth">
            <span className="nav-username">{username}</span>
            <button className="nav-new" onClick={() => navigate('/new')}>+</button>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </div>
        ) : (
            <button className="nav-login" onClick={() => navigate('/login')}>
            Login
            </button>
        )}
        </nav>
    )
}