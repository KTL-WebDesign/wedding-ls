
import { useEffect, useRef } from "react";
import "./InvitationPage.scss";
import { useNavigate } from "react-router-dom";

// GitHub Pages 相容路徑
const BASE = `${import.meta.env.BASE_URL}assets/invitation/`;
const WELCOME_BASE = `${import.meta.env.BASE_URL}assets/welcome/`;

const asset = (name) => `${BASE}${name}`;

function InvitationPage({ isPlaying, toggleMusic }) {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const elements = page.querySelectorAll(".scroll-reveal");

    // 啟用動畫樣式
    page.classList.add("reveal-ready");

    // 瀏覽器不支援 IntersectionObserver 時直接顯示
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="invitation-page"
      style={{
        "--sky-background": `url("${WELCOME_BASE}background-sky.png")`,
        "--paper-background": `url("${asset("paper-bg.png")}")`,
      }}
    >

      <div className="invitation-card">

        {/* 右上角音樂控制 */}
        <button
          type="button"
          className="music-control"
          onClick={toggleMusic}
          aria-label={isPlaying ? "暫停音樂" : "播放音樂"}
          title={isPlaying ? "暫停音樂" : "播放音樂"}
        >
          {isPlaying ? "♫" : "♪"}
        </button>



        {/* 01｜主視覺 */}
        <section className="invite-kv">
          <img
            className="invite-kv-bg"
            src={asset("kv-bg.png")}
            alt="新人婚紗照"
          />
          <img
            className="invite-kv-title intro-fade"
            src={asset("kv-title.png")}
            alt="婚禮邀請"
          />
        </section>

        {/* 02｜新人介紹與照片 */}
        <section className="invite-introduction">

          {/* 日期與標題 */}
          <div className="invite-intro-heading">
            <img
              className="invite-part2-time intro-fade intro-fade-delay"
              src={asset("part-2-time.png")}
              alt="2026.12.13 星期日晚宴"
            />

            <img
              className="invite-part2-title intro-fade intro-fade-delay"
              src={asset("part-2-title.png")}
              alt=""
            />
          </div>

          {/* 照片無縫跑馬燈 */}
          <div className="invite-film-marquee">
            <div className="invite-film-track">

              <img src={asset("part-2-photo-1.png")} alt="新人婚紗照" />
              <img src={asset("part-2-photo-2.png")} alt="新人婚紗照" />
              <img src={asset("part-2-photo-3.png")} alt="新人婚紗照" />

              {/* 重複一次，確保無縫循環 */}
              <img src={asset("part-2-photo-1.png")} alt="" aria-hidden="true" />
              <img src={asset("part-2-photo-2.png")} alt="" aria-hidden="true" />
              <img src={asset("part-2-photo-3.png")} alt="" aria-hidden="true" />

            </div>
          </div>

          {/* 底部裝飾 */}
          <img
            className="invite-part2-span"
            src={asset("part-2-span.png")}
            alt=""
          />

          {/* 新人介紹區 */}
          <div className="invite-couple-scene">

            {/* 背景：靜態 */}
            <img
              className="invite-couple-bg"
              src={asset("invitation-bg.png")}
              alt=""
            />

            {/* INVITATION 標題：靜態 */}
            <img
              className="invite-couple-title"
              src={asset("invitation-title.png")}
              alt="INVITATION"
            />

            {/* 新人介紹內容 */}
            <div className="invite-couple">

              {/* 左右手：不使用 scroll-reveal */}
              <img
                className="invite-groom"
                src={asset("invitation-groom-left.png")}
                alt=""
              />

              <img
                className="invite-bride"
                src={asset("invitation-bride-right.png")}
                alt=""
              />

              {/* 姓名、愛心、主婚人：保留捲動淡入 */}
              <img
                className="invite-couple-content scroll-reveal"
                src={asset("invitation-content.png")}
                alt="新人姓名與介紹"
              />

            </div>
          </div>

          {/* 新人牽手照片：保持靜態 */}
          <img
            className="invite-couple-photo"
            src={asset("invitation-photo.png")}
            alt="新人牽手照片"
          />

        </section>
        {/* 03｜日期與時間 */}
        <section className="invite-datetime">

          {/* 日期標題 */}
          <img
            className="invite-section-title"
            src={asset("datetime-title.png")}
            alt="Date & Time"
          />

          {/* 日期文字 */}
          <img
            className="invite-datetime-time"
            src={asset("datetime-time.png")}
            alt="2026年12月13日 星期日晚宴"
          />

          {/* 月曆 */}
          <div className="invite-calendar">
            <img
              className="invite-calendar-bg"
              src={asset("datetime-calendar-bg.png")}
              alt=""
            />

            <img
              className="invite-calendar-content"
              src={asset("datetime-calendar-content.png")}
              alt="2026年12月月曆"
            />

            <img
              className="invite-calendar-heart"
              src={asset("datetime-calendar-heart.png")}
              alt=""
            />
          </div>

          {/* 婚禮流程 */}
          <div className="invite-program">

            <img
              className="invite-program-bg"
              src={asset("wedding-program-bg.png")}
              alt=""
            />

            <img
              className="invite-program-line"
              src={asset("wedding-program-line.png")}
              alt=""
            />

            <img
              className="invite-program-item program-one"
              src={asset("wedding-program-1.png")}
              alt="17:00 入席"
            />

            <img
              className="invite-program-item program-two"
              src={asset("wedding-program-2.png")}
              alt="17:10 迎賓"
            />

            <img
              className="invite-program-item program-three"
              src={asset("wedding-program-3.png")}
              alt="18:00 晚宴"
            />

            <img
              className="invite-program-photo"
              src={asset("wedding-program-photo.png")}
              alt=""
            />

          </div>

          {/* 加入行事曆 */}
          <img
            className="invite-program-button"
            src={asset("wedding-program-button.png")}
            alt="加入行事曆"
          />

          {/* 下方裝飾照片 */}
          <img
            className="invite-datetime-bottom"
            src={asset("part-2-photo-3.png")}
            alt=""
          />

        </section>

        {/* 04｜婚禮地點 */}
        <section className="invite-location">
          <div className="invite-location-heading">
            <img
              className="invite-location-bg"
              src={asset("location-bg.png")}
              alt=""
            />
            <img
              className="invite-location-flower flower-one"
              src={asset("location-flower.png")}
              alt=""
            />
            <img
              className="invite-location-flower flower-two"
              src={asset("location-flower2.png")}
              alt=""
            />
            <img
              className="invite-location-title"
              src={asset("location-title.png")}
              alt="Location"
            />
            <img
              className="invite-location-content"
              src={asset("location-content.png")}
              alt="婚禮場地資訊"
            />
          </div>

          <img
            className="invite-location-photo"
            src={asset("location-photo.png")}
            alt="婚禮場地照片"
          />

          <div className="invite-map">
            <img
              src={asset("openmap-bg.png")}
              alt=""
            />
            <img
              className="invite-map-button"
              src={asset("openmap-button.png")}
              alt="打開地圖"
            />
          </div>
        </section>

        {/* 05｜Save the Date */}
        <section className="invite-ending">
          <img
            src={asset("theend-photo.png")}
            alt="新人海邊婚紗照"
          />
        </section>

        {/* 頁面底部操作 */}
        <div className="invite-bottom-actions">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="invite-back-button"
          >
            ← 返回首頁
          </button>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="invite-top-button"
            aria-label="回到頂部"
          >
            <img src={asset("scrolltotop.png")} alt="" />
          </button>

        </div>

      </div>
    </main>
  );
}

export default InvitationPage;
