import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SubmissionForm from '../components/SubmissionForm'

export default function MessageDetail() {
    const { id } = useParams()
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:5000/api/messages')
        .then(res => res.json())
        .then(data => {
            const found = data.find(msg => msg.id === parseInt(id))
            setMessage(found)
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
            <img src={message.media_url || '/placeholder.jpg'} alt="thumbnail" className="detail-thumbnail" />
            <div className="detail-info">
            <span className="detail-to">To: {message.username}</span>
            <p className="detail-content">{message.content}</p>
            </div>
        </div>

        {message.external_id && (
            <div className="player-section">
            <p className="player-label">Song for you</p>
            <iframe
                src={`https://www.youtube.com/embed/${message.external_id}`}
                allowFullScreen
                className="yt-player"
            />
            </div>
        )}

        <div className="submission-section">
            <h2 className="submission-title">Submission</h2>
            <SubmissionForm />
        </div>

        </div>
    )
}