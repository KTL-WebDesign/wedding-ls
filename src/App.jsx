import { HashRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage/WelcomePage";
import InvitationPage from "./pages/InvitationPage/InvitationPage";

const BASE = `${import.meta.env.BASE_URL}assets/welcome/`;

function App() {
  return (
    <HashRouter>
      <audio
        id="wedding-bgm"
        src={`${BASE}bgm.mp3`}
        loop
        preload="none"
      />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/invitation" element={<InvitationPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;