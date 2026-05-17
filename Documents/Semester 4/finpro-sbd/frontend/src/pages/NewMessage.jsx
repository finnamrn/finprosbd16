import Navbar from '../components/Navbar'
import SubmissionForm from '../components/SubmissionForm'

export default function NewMessage() {
    return (
        <div>
        <Navbar />
        <div className="submission-section">
            <h2 className="submission-title">Submission</h2>
            <SubmissionForm />
        </div>
        </div>
    )
}