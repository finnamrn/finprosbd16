import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MessageDetail from './pages/MessageDetail'
import NewMessage from './pages/NewMessage'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code && !localStorage.getItem("spotify_token")) {
      import('./utils/spotify').then(({ processSpotifyToken }) => {
        processSpotifyToken()
      })
    } 
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages/:id" element={<MessageDetail />} />
        <Route path="/new" element={<NewMessage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}