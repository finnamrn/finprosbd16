import { useNavigate } from 'react-router-dom'

export default function MessageCard({ message }) {
    const navigate = useNavigate()

    return (
        <div className="message-card" onClick={() => navigate(`/messages/${message.id}`)}>
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