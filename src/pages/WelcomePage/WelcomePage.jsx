
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.scss";

// public/assets/welcome/
const BASE = `${import.meta.env.BASE_URL}assets/welcome/`;
const asset = (name) => `${BASE}${name}`;

const WEDDING_DATE = new Date("2026-12-13T17:00:00+08:00");

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

  const [displayValue, setDisplayValue] = useState(current);
  const [nextValue, setNextValue] = useState(current);
  const [isFlipping, setIsFlipping] = useState(false);

  const timerRef = useRef(null);
  const displayRef = useRef(current);

  useEffect(() => {
    if (current === displayRef.current) return;

    // 先記錄舊數字，並立即更新 ref，避免重複觸發
    const previous = displayRef.current;
    displayRef.current = current;

    window.clearTimeout(timerRef.current);

    // 固定這次翻頁的前後數字
    setDisplayValue(previous);
    setNextValue(current);
    setIsFlipping(true);

    timerRef.current = window.setTimeout(() => {
      setDisplayValue(current);
      setIsFlipping(false);
    }, 600);

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [current]);

  return (
    <div className="flip-unit">
      <div className={`flip-card ${isFlipping ? "is-flipping" : ""}`}>

        {/* 底層：新數字上半部 */}
        <div className="flip-face flip-top">
          {nextValue}
        </div>

        {/* 底層：舊數字下半部 */}
        <div className="flip-face flip-bottom">
          {displayValue}
        </div>

        {/* 上半部：舊數字向後翻 */}
        {isFlipping && (
          <div className="flip-face flip-flap-top">
            {displayValue}
          </div>
        )}

        {/* 下半部：新數字向前翻入 */}
        {isFlipping && (
          <div className="flip-face flip-flap-bottom">
            {nextValue}
          </div>
        )}

      </div>

      <span className="flip-unit-label">{label}</span>
    </div>
  );
}


function FlipCountdown({ isActive }) {
  const [time, setTime] = useState(getCountdown);

  const isCompleted =
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0;

  useEffect(() => {
    const update = () => setTime(getCountdown());
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={`countdown-result ${isActive && isCompleted ? "is-completed" : ""
        }`}
    >
      <div className="flip-countdown" aria-label="婚禮倒數">
        <FlipUnit value={time.days} label="天" />
        <FlipUnit value={time.hours} label="時" />
        <FlipUnit value={time.minutes} label="分" />
        <FlipUnit value={time.seconds} label="秒" />
      </div>
    </div>
  );
}

function WelcomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const secondSectionRef = useRef(null);
  const printTimerRef = useRef(null);
  const finalButtonTimerRef = useRef(null);

  const [printStarted, setPrintStarted] = useState(false);
  const [printFinished, setPrintFinished] = useState(false);
  const [showLetterPrompt, setShowLetterPrompt] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [countdownEntered, setCountdownEntered] = useState(false);

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

  // 列印完成後，再延遲 2.5 秒顯示收信視窗
  useEffect(() => {
    if (!printFinished) return;

    const timer = window.setTimeout(() => {
      setShowLetterPrompt(true);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [printFinished]);

  // 點擊收信
  const handleOpenLetter = async () => {
    if (!printFinished || letterOpened) return;

    setShowLetterPrompt(false);
    setLetterOpened(true);

    // 點擊後播放音樂
    const audio = document.getElementById("wedding-bgm");

    if (audio) {
      try {
        await audio.play();
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
  navigate("/invitation", {
    state: { triggerConfetti: Date.now() },
  });
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
      <div className="welcome-card">


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
              {/* 熊貓印表機 */}
              <img
                className="printer-image"
                src={asset("panda-printer.gif")}
                alt="熊貓印表機"
                draggable="false"
              />

            </div>
          </div>


          {/* 收信彈出視窗 */}
          {showLetterPrompt && (
            <div className="letter-modal">
              <div className="letter-backdrop" />

              <button
                type="button"
                className="letter-prompt"
                onClick={handleOpenLetter}
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
            </div>
          )}

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
                src={asset("photo-strip-2.png")}
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
          <div
            className="countdown-area"
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) {
                setCountdownEntered(true);
              }
            }}
          >
            <FlipCountdown isActive={countdownEntered} />
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
      </div>
    </main>
  );
}

export default WelcomePage;
