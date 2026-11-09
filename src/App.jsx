
import { useState } from 'react'
import WelcomePage from './pages/WelcomePage/WelcomePage'
import InvitationPage from './pages/InvitationPage/InvitationPage'

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')

  return (
    <>
      {currentPage === 'welcome' ? (
        <WelcomePage
          onOpenInvitation={() => setCurrentPage('invitation')}
        />
      ) : (
        <InvitationPage
          onBackToWelcome={() => setCurrentPage('welcome')}
        />
      )}
    </>
  )
}

export default App
