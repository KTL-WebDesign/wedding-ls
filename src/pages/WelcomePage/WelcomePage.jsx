
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.scss";

// public/assets/welcome/
const BASE = `${import.meta.env.BASE_URL}assets/welcome/`;
const asset = (name) => `${BASE}${name}`;

const WEDDING_DATE = new Date(2026, 11, 13, 0, 0, 0);

function getCountdown() {
  const now = new Date();
  const diff = Math.max(0, WEDDING_DATE.getTime() - now.getTime());

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

// 翻頁數字

function FlipUnit({ value, label }) {
  const current = String(value).padStart(2, "0");

  return (
    <div className="flip-unit">
      <div className="flip-card" key={current}>
        <span className="flip-card-number">{current}</span>
      </div>

      <span className="flip-unit-label">{label}</span>
    </div>
  );
}


function FlipCountdown() {
  const [time, setTime] = useState(getCountdown);

  useEffect(() => {
    const update = () => setTime(getCountdown());
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flip-countdown" aria-label="婚禮倒數">
      <FlipUnit value={time.days} label="天" />
      <FlipUnit value={time.hours} label="時" />
      <FlipUnit value={time.minutes} label="分" />
      <FlipUnit value={time.seconds} label="秒" />
    </div>
  );
}

function WelcomePage() {
  const navigate = useNavigate();

  const audioRef = useRef(null);
  const secondSectionRef = useRef(null);
  const printTimerRef = useRef(null);
  const finalButtonTimerRef = useRef(null);

  const [printStarted, setPrintStarted] = useState(false);
  const [printFinished, setPrintFinished] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);

  useEffect(() => {
    // 進入頁面後 1 秒開始列印
    const startTimer = window.setTimeout(() => {
      setPrintStarted(true);
    }, 1000);

    // 1 秒等待 + 3.8 秒列印
    printTimerRef.current = window.setTimeout(() => {
      setPrintFinished(true);
    }, 4800);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(printTimerRef.current);
    };
  }, []);

  // 點擊收信
  const handleOpenLetter = async () => {
    if (!printFinished || letterOpened) return;

    setLetterOpened(true);

    // 點擊後播放音樂
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn("背景音樂播放失敗：", error);
      }
    }

    // 滑動至第二區
    secondSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // 延遲顯示最後按鈕
    finalButtonTimerRef.current = window.setTimeout(() => {
      setShowFinalButton(true);
    }, 4800);
  };

  // 前往正式喜帖
  const handleGoToInvitation = () => {
    navigate("/invitation");
    window.scrollTo(0, 0);
  };

  // 清除計時器
  useEffect(() => {
    return () => {
      window.clearTimeout(printTimerRef.current);
      window.clearTimeout(finalButtonTimerRef.current);
    };
  }, []);

  return (
    <main
      className="welcome-page"
      style={{
        "--sky-background": `url("${asset("background-sky.png")}")`,
      }}
    >
      <audio
        ref={audioRef}
        src={asset("bgm.mp3")}
        loop
        preload="none"
      />

      {/* 第一區：照片列印 */}
      <section className="printing-section">
        <div className="printer-scene">
          <div className="printer-art">

            {/* 照片條 */}
            <div
              className={`printed-photo ${printStarted ? "is-printing" : ""
                } ${printFinished ? "is-finished" : ""}`}
            >
              <img
                src={asset("photo-strip.png")}
                alt="新人照片列"
                draggable="false"
              />
            </div>

            {/* 印表機 */}
            <img
              className="printer-image"
              src={asset("panda-printer.png")}
              alt="熊貓照片印表機"
              draggable="false"
            />



          </div>
        </div>

        {/* 收信提示 */}

        <button
          type="button"
          className={`letter-prompt ${printFinished ? "is-visible" : ""
            }`}
          onClick={handleOpenLetter}
          disabled={!printFinished || letterOpened}
          aria-label="叮咚！你收到一封邀請函，點擊此處收信"
        >
          <img
            className="prompt-title"
            src={asset("received-title.png")}
            alt="叮咚！你收到一封邀請函"
          />

          <img
            className="prompt-subtitle"
            src={asset("click-to-open.png")}
            alt="點擊此處收信"
          />

          <img
            className="prompt-heart"
            src={asset("heart.png")}
            alt=""
          />
        </button>

      </section>

      {/* 第二區：邀請函 */}
      <section
        ref={secondSectionRef}
        className={`invitation-section ${letterOpened ? "is-active" : ""
          }`}
      >
        {/* 主視覺 */}
        <div className="invitation-scene">

          {/* 信封三層 */}
          <div className="envelope">

            <img
              className="envelope-back"
              src={asset("envelope-back.png")}
              alt=""
              draggable="false"
            />

            <img
              className="envelope-photo"
              src={asset("envelope-photo.png")}
              alt="新人婚紗照"
              draggable="false"
            />

            <img
              className="envelope-front"
              src={asset("envelope-front.png")}
              alt=""
              draggable="false"
            />

          </div>

          {/* 左側照片條 */}
          <div className="side-photo">
            <img
              src={asset("photo-strip.png")}
              alt="新人照片"
              draggable="false"
            />
          </div>

          {/* 右側黑膠與唱臂 */}
          <div className="vinyl-scene">

            <img
              className="vinyl-record"
              src={asset("vinyl.png")}
              alt="黑膠唱片"
              draggable="false"
            />

            <img
              className="vinyl-tonearm"
              src={asset("tonearm.png")}
              alt=""
              draggable="false"
            />

          </div>
        </div>

        {/* 新人姓名 */}
        <div className="couple-title">
          <img
            src={asset("couple-title.png")}
            alt="銘岱與書儂 We're Getting Married"
            draggable="false"
          />
        </div>

        {/* 倒數 */}
        <div className="countdown-area">
          <FlipCountdown />
        </div>

        {/* 愛心及線條 */}
        <div className="heart-line">
          <img
            src={asset("heart-line.png")}
            alt=""
            draggable="false"
          />
        </div>

        {/* 打開喜帖 */}
        <button
          type="button"
          className={`open-invitation ${showFinalButton ? "is-visible" : ""
            }`}
          onClick={handleGoToInvitation}
          disabled={!showFinalButton}
          aria-label="打開喜帖"
        >
          <img
            src={asset("open-invitation-button.png")}
            alt="打開喜帖"
            draggable="false"
          />
        </button>
      </section>
    </main>
  );
}

export default WelcomePage;
