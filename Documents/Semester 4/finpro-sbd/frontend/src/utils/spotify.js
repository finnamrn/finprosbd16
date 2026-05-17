const CLIENT_ID = 'd4f28e7698df462da9f27a34f21ccd5a'
const REDIRECT_URI = 'http://127.0.0.1:5173'
const SCOPES = 'user-read-private'

export function getSpotifyToken() {
    return localStorage.getItem('spotify_token')
    }

    export function loginSpotify() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=token`
    }

    export async function searchSpotify(query, token) {
    const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    return data.tracks.items
}