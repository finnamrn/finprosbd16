import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const navigate = useNavigate()

    return (
        <nav className="navbar">
        <button className="nav-icon" onClick={() => navigate('/')}>
            ➤
        </button>
        <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search for a name" />
        </div>
        </nav>
    )
}