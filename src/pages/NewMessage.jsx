import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SubmissionForm from '../components/SubmissionForm'

export default function NewMessage() {
    const navigate = useNavigate()

    // Mengecek otomatis saat halaman dibuka
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login') // Tendang ke login kalau tidak ada token
        }
    }, [navigate])

    return (
        <div>
            <Navbar />
            <div className="submission-section">
                <SubmissionForm />
            </div>
        </div>
    )
}