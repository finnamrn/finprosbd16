import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ onSearch }) {
    const navigate = useNavigate()
    const location = useLocation()
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')

    // Mengecek apakah posisi saat ini ada di halaman utama (Home)
    const isHomePage = location.pathname === '/'

    function handleLogout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('spotify_token')
        navigate('/')
    }

    function handleLeftIconClick() {
    if (isHomePage) {
        if (token) {
            navigate('/new') 
        } else {
            navigate('/login') 
        }
    } else {
        navigate(-1) 
     }
    }

    return (
        <nav className="navbar">
            {/* Bagian Kiri: Tombol Icon */}
            <button className="nav-icon" onClick={handleLeftIconClick}>
                <img 
                    src={isHomePage ? "/arrow.png" : "/back.png"} 
                    alt={isHomePage ? "new-message" : "back"} 
                />
            </button>

            {/* Bagian Tengah: Search Bar (Hanya muncul di Home) */}
            {isHomePage && (
                <div className="search-bar">
                    <img src="/search.png" alt="search" />
                    <input
                        type="text"
                        placeholder="Search for a name"
                        onChange={e => onSearch && onSearch(e.target.value)}
                    />
                </div>
            )}

            {/* Bagian Kanan: Login & Auth (Hanya muncul di Home) */}
            {isHomePage && (
                token ? (
                    <div className="nav-auth">
                        <span className="nav-username">{username}</span>
                        <button className="nav-new" onClick={() => navigate('/new')}>+</button>
                        <button className="nav-logout" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <button className="nav-login" onClick={() => navigate('/login')}>
                        Login
                    </button>
                )
            )}
        </nav>
    )
}