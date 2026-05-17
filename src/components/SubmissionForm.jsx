import { useState, useEffect } from 'react'
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

    useEffect(() => {
        if (!songQuery.trim()) {
            setSongResults([])
            return
        }

        const delaySearch = setTimeout(() => {
            handleSongSearch()
        }, 500)

        return () => clearTimeout(delaySearch)
    }, [songQuery]) 

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

        // upload image dulu ke backend
        if (image) {
            const formData = new FormData()
            formData.append('image', image)

            const uploadRes = await fetch('https://finprosbdkel16backend-production.up.railway.app/api/upload', {
                method: 'POST',
                body: formData
            })

            const uploadData = await uploadRes.json()

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Upload gagal')
            }

            imageUrl = uploadData.imageUrl
        }

        const messageBody = {
            recipient_name: to,
            content: content,
            media_type: selectedSong
                ? 'spotify'
                : imageUrl
                ? 'image'
                : null,

            media_url: imageUrl || null,

            external_id: selectedSong
                ? selectedSong.id
                : null
        }

        const res = await fetch('https://finprosbdkel16backend-production.up.railway.app/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(messageBody)
        })

        if (!res.ok) {
            throw new Error('Gagal kirim message')
        }

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
                placeholder="To: Enter Name"
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
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="spotify-preview"
        style={{ borderRadius: '12px', marginTop: '15px' }} 
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