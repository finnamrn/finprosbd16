import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MessageCard({ message, index }) {
    const navigate = useNavigate()
    const cardRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible')
                observer.unobserve(entry.target)
            }
            })
        },
        { threshold: 0.1 }
        )

        if (cardRef.current) observer.observe(cardRef.current)

        return () => observer.disconnect()
    }, [])

    return (
        <div
        ref={cardRef}
        className="message-card"
        style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
        onClick={() => navigate(`/messages/${message.id}`)}
        >
        <img
            src={message.media_url || '/placeholder.jpg'}
            alt="thumbnail"
            className="card-thumbnail"
        />
        <p className="card-content">{message.content}</p>
        <span className="card-to">To: {message.username}</span>
        </div>
    )
}