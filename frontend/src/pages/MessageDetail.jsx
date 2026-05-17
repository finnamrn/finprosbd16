import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MessageDetail() {
    const { id } = useParams()
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    fetch(`https://finprosbdkel16backend-production.up.railway.app/api/messages/${id}`)
        .then(res => res.json())
        .then(data => {
            setMessage(data)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!message) return <p>Message not found</p>

    return (
        <div>
        <Navbar />

        <div className="detail-card">
            <img src={message.media_url || '/placeholder.jpg'} alt="thumbnail" className="detail-thumbnail-box" /> {/* <-- Ubah class name ini aja */}
            <div className="detail-info">
            <span className="detail-to">To: {message.recipient_name}</span>
            <p className="detail-content">{message.content}</p>
            </div>
        </div>

    {message.external_id && message.media_type === 'spotify' && (
    <div className="player-section">
        <p className="player-label">Soundtrack for you </p>
        <iframe
            src={`https://open.spotify.com/embed/track/${message.external_id}`}
            width="100%"
            height="152" 
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="spotify-player"
            style={{ borderRadius: '12px' }}
        />
    </div>
    )}


        </div>
    )
}