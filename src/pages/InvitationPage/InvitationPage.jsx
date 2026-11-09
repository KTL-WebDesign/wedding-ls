
import './InvitationPage.scss'

function InvitationPage({ onBackToWelcome }) {
  return (
    <main className="invitation-page">
      <h1>Wedding Invitation</h1>
      <p>You're Invited!</p>

      <button onClick={onBackToWelcome}>
        返回首頁
      </button>
    </main>
  )
}

export default InvitationPage
