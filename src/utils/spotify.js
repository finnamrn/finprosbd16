const CLIENT_ID = 'd4f28e7698df462da9f27a34f21ccd5a'
const REDIRECT_URI = 'http://127.0.0.1:5173'

export function getSpotifyToken() {
    return localStorage.getItem('spotify_token')
}

// 1. Fungsi Login PKCE
export async function loginSpotify() {
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    
    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }
    
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const codeVerifier = generateRandomString(64);
    window.localStorage.setItem('spotify_code_verifier', codeVerifier);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // INI URL ASLI SPOTIFY (Jangan sampai terganti jadi googleusercontent)
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    authUrl.search = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: 'user-read-private',
        redirect_uri: REDIRECT_URI,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
    }).toString();

    window.location.href = authUrl.toString();
}

// 2. Fungsi Penukar Kode menjadi Token
export async function processSpotifyToken() {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
        const codeVerifier = localStorage.getItem('spotify_code_verifier')

        try {
            const response = await fetch(
                'https://accounts.spotify.com/api/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: REDIRECT_URI,
                        client_id: CLIENT_ID,
                        code_verifier: codeVerifier
                    })
                }
            )

            const data = await response.json()
            console.log(data)

            if (data.access_token) {
                localStorage.setItem('spotify_token', data.access_token)
                localStorage.removeItem('spotify_code_verifier')
                window.history.replaceState({}, document.title, window.location.pathname)
            } else {
                console.error("Spotify token gagal:", data)
            }

        } catch (err) {
            console.error(err)
        }
    }
}

// 3. Fungsi Search API asli Spotify
export async function searchSpotify(query, token) {
    try {
        const res = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const data = await res.json()

        console.log("Spotify Search Response:", data)

        return data.tracks?.items || []
    } catch (error) {
        console.error("Gagal melakukan pencarian:", error)
        return []
    }
}