
import { useEffect, useRef, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import WelcomePage from "./pages/WelcomePage/WelcomePage";
import InvitationPage from "./pages/InvitationPage/InvitationPage";

const BASE = `${import.meta.env.BASE_URL}assets/welcome/`;

function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 播放／暫停音樂
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.warn("背景音樂播放失敗：", error);
      }
    } else {
      audio.pause();
    }
  };

  // 同步音樂播放狀態
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      sessionStorage.setItem("wedding-music", "playing");
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // 重新整理後嘗試恢復播放
    if (sessionStorage.getItem("wedding-music") === "playing") {
      audio.play().catch(() => {
        // 瀏覽器阻擋時，等待使用者手動播放
      });
    }

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <HashRouter>
      {/* 全站共用音樂播放器 */}
      <audio
        ref={audioRef}
        id="wedding-bgm"
        src={`${BASE}bgm.mp3`}
        loop
        preload="auto"
      />

      <Routes>
        <Route path="/" element={<WelcomePage />} />

        {/* 把音樂狀態傳給第二頁 */}
        <Route
          path="/invitation"
          element={
            <InvitationPage
              isPlaying={isPlaying}
              toggleMusic={toggleMusic}
            />
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
