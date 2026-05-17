import { useState } from 'react'

export default function SubmissionForm() {
    const [to, setTo] = useState('')
    const [content, setContent] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [songQuery, setSongQuery] = useState('')
    const [songResults, setSongResults] = useState([])
    const [selectedSong, setSelectedSong] = useState(null)

    function handleImageChange(e) {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setImagePreview(URL.createObjectURL(file))
    }

    return (
        <div className="submission-form">
        <h2 className="submission-title">Send your message</h2>

        <div className="form-main">
            <label className="image-upload">
            {imagePreview 
                ? <img src={imagePreview} alt="preview" className="image-preview" />
                : <div className="image-placeholder">
                    <span>📷</span>
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
            <span className="search-icon">🔍</span>
            <input
            type="text"
            placeholder="Pick your song here"
            value={songQuery}
            onChange={e => setSongQuery(e.target.value)}
            className="song-input"
            />
        </div>

        {selectedSong && (
            <div className="selected-song">
            <img src={selectedSong.thumbnail} alt="song" />
            <span>{selectedSong.title}</span>
            </div>
        )}

        <button className="submit-btn">Submit</button>
        </div>
    )
}