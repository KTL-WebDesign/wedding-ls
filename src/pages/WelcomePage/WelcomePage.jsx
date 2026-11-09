
import './WelcomePage.scss'

function WelcomePage({ onOpenInvitation }) {
  return (
    <main className="welcome-page">
      <h1>Welcome</h1>
      <p>Wedding Invitation</p>

      <button onClick={onOpenInvitation}>
        打開喜個
      </button>
    </main>
  )
}

export default WelcomePage
