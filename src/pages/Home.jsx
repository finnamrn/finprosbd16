import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MessageCard from '../components/MessageCard'
import { processSpotifyToken } from '../utils/spotify' 

export default function Home() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        processSpotifyToken(); 

        const url = search.trim()
        ? `https://finprosbdkel16backend-production.up.railway.app/api/messages?search=${encodeURIComponent(search)}`
        : 'https://finprosbdkel16backend-production.up.railway.app/api/messages'

        fetch(url)
        .then(res => res.json())
        .then(data => {
            setMessages(data)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [search])

    return (
        <div>
        <Navbar onSearch={setSearch} />

        <div className="profile-banner">
            <img src="/profile.jpg" alt="profile" className="profile-pic" />
            <div className="profile-info">
            <span className="profile-label">Profile</span>
            <h1 className="app-title">EchoDrop</h1>
            <p className="app-subtitle">Where anonymous hearts leave their soundtrack</p>
            </div>
        </div>

        <div className="feed-section">
            <div className="feed-header">
            <h2 className="feed-title">Public Messages</h2>
            <p className="feed-count">{messages.length} Messages found</p>
            </div>

            <div className="card-grid">
            {loading
                ? <p>Loading...</p>
                : messages.length === 0
                ? <p className="empty-state">No Messages Sent</p>
                : messages.map((msg, index) => (
                    <MessageCard key={msg.id} message={msg} index={index} />
                ))
            }
            </div>
        </div>
        </div>
    )
}