import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSpotifyToken, loginSpotify, searchSpotify } from '../utils/spotify'

export default function SubmissionForm() {
    const navigate = useNavigate()
    const [to, setTo] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [songQuery, setSongQuery] = useState('')
    const [songResults, setSongResults] = useState([])
    const [selectedSong, setSelectedSong] = useState(null)
    const [searching, setSearching] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    async function handleSongSearch() {
        const token = getSpotifyToken()
        if (!token) {
        loginSpotify()
        return
        }
        if (!songQuery.trim()) return
        setSearching(true)
        const results = await searchSpotify(songQuery, token)
        setSongResults(results)
        setSearching(false)
    }

    function handleSelectSong(track) {
        setSelectedSong(track)
        setSongResults([])
        setSongQuery(track.name)
    }

    async function handleSubmit() {
        const token = localStorage.getItem('token')
        if (!token) {
        navigate('/login')
        return
        }

        if (!content.trim()) {
        alert('Pesan tidak boleh kosong')
        return
        }

        setSubmitting(true)

        try {
        let imageUrl = null

        if (image) {
            const formData = new FormData()
            formData.append('image', image)
            const uploadRes = await fetch('http://localhost:5000/api/upload', {
            method: 'POST',
            body: formData
            })
            const uploadData = await uploadRes.json()
            imageUrl = uploadData.url
        }

        const messageBody = {
            content: `To: ${to}\n${content}`,
            media_type: selectedSong ? 'spotify' : imageUrl ? 'image' : null,
            media_url: selectedSong
            ? `https://open.spotify.com/track/${selectedSong.id}`
            : imageUrl,
            external_id: selectedSong ? selectedSong.id : null
        }

        await fetch('http://localhost:5000/api/messages', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(messageBody)
        })

        navigate('/')
        } catch (err) {
        console.error(err)
        alert('Gagal mengirim pesan')
        } finally {
        setSubmitting(false)
        }
    }

    return (
        <div className="submission-form">
        <h2 className="submission-title">Send your message</h2>

        <div className="form-main">
            <label className="image-upload">
            {imagePreview
                ? <img src={imagePreview} alt="preview" className="image-preview" />
                : <div className="image-placeholder">
                    <img src="/camera.png" alt="camera" className="camera-icon" />
                    <p>add image</p>
                </div>
            }
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
            />
            </label>

            <div className="form-fields">
            <input
                type="text"
                placeholder="Enter Name"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="input-to"
            />
            <textarea
                placeholder="Type your message here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="input-message"
            />
            </div>
        </div>

        <div className="song-picker">
            <img src="/search.png" alt="search" />
            <input
            type="text"
            placeholder="Pick your song here"
            value={songQuery}
            onChange={e => setSongQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSongSearch()}
            className="song-input"
            />
        </div>

        {searching && <p>Searching...</p>}

        {songResults.length > 0 && (
            <div className="song-results">
            {songResults.map(track => (
                <div
                key={track.id}
                className="song-result-item"
                onClick={() => handleSelectSong(track)}
                >
                <img src={track.album.images[2]?.url} alt="album" />
                <div>
                    <p>{track.name}</p>
                    <span>{track.artists[0].name}</span>
                </div>
                </div>
            ))}
            </div>
        )}

        {selectedSong && (
            <iframe
            src={`https://open.spotify.com/embed/track/${selectedSong.id}`}
            width="100%"
            height="80"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="spotify-preview"
            />
        )}

        <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
        >
            {submitting ? 'Sending...' : 'Submit'}
        </button>
        </div>
    )
}