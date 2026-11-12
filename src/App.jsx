
import { HashRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage/WelcomePage";
import InvitationPage from "./pages/InvitationPage/InvitationPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/invitation" element={<InvitationPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
