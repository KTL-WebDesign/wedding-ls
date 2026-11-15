
import { useEffect, useRef, useState } from "react";
import "./InvitationPage.scss";
import { useNavigate, useLocation } from "react-router-dom";
import KvConfetti from "../../components/KvConfetti";

// GitHub Pages 相容路徑
const BASE = `${import.meta.env.BASE_URL}assets/invitation/`;
const WELCOME_BASE = `${import.meta.env.BASE_URL}assets/welcome/`;

const asset = (name) => `${BASE}${name}`;

function InvitationPage({ isPlaying, toggleMusic }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [confettiKey, setConfettiKey] = useState(0);
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
          <KvConfetti key={`${location.key}-${confettiKey}`} />
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
            src={asset("part-2-time.png")}
            alt="2026年12月13日 星期日晚宴"
          />

          {/* 月曆：整組一起浮現 */}
          <div className="invite-calendar scroll-reveal">

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

            {/* 背景 */}
            <img
              className="invite-program-bg scroll-reveal"
              src={asset("wedding-program-bg.png")}
              alt=""
            />

            {/* 流程線條 */}
            <img
              className="invite-program-line"
              src={asset("wedding-program-line.png")}
              alt=""
            />

            {/* 流程一 */}
            <img
              className="invite-program-item program-one scroll-reveal reveal-delay-2"
              src={asset("wedding-program-1.png")}
              alt="17:00 入席"
            />

            {/* 流程二 */}
            <img
              className="invite-program-item program-two scroll-reveal reveal-delay-3"
              src={asset("wedding-program-2.png")}
              alt="17:10 迎賓"
            />

            {/* 流程三 */}
            <img
              className="invite-program-item program-three scroll-reveal reveal-delay-4"
              src={asset("wedding-program-3.png")}
              alt="18:00 晚宴"
            />

          </div>

          {/* 加入行事曆：按鈕先出現 */}
          <div className="invite-program-button-wrap scroll-reveal reveal-delay-5">
            <a
              href={`${import.meta.env.BASE_URL}assets/invitation/wedding-event.ics`}
              download="wedding-event.ics"
              className="invite-program-button-link"
            >
              <img
                className="invite-program-button"
                src={asset("wedding-program-button.png")}
                alt="加入行事曆"
              />
            </a>
          </div>

          {/* 流程底部裝飾照片 */}
          <img
            className="invite-program-photo"
            src={asset("wedding-program-photo.png")}
            alt=""
          />



        </section>

        <section className="invite-location">

          {/* 獨立背景層 */}
          <img
            className="invite-location-bg"
            src={asset("location-bg.png")}
            alt=""
          />

          {/* 地點資訊 */}
          <div className="invite-location-heading">

            <img
              className="invite-location-title"
              src={asset("location-title.png")}
              alt="Location Chalet V"
            />

            <img
              className="invite-location-flower flower-one scroll-reveal"
              src={asset("location-flower.png")}
              alt=""
            />

            <img
              className="invite-location-content scroll-reveal reveal-delay-1"
              src={asset("location-content.png")}
              alt="婚禮地址與交通資訊"
            />

            <img
              className="invite-location-flower flower-two scroll-reveal reveal-delay-2"
              src={asset("location-flower2.png")}
              alt=""
            />

          </div>

          {/* 場地照片 */}
          <img
            className="invite-location-photo"
            src={asset("location-photo.png")}
            alt="婚禮場地照片"
          />

          {/* 地圖區：獨立背景與按鈕圖層 */}
          <div className="invite-map-scene">

            {/* 背景：保留原始圖片比例 */}
            <img
              className="invite-map-bg"
              src={asset("openmap-bg.png")}
              alt=""
            />

            {/* 按鈕：疊在背景正中央 */}
            <div className="invite-map-button-wrap scroll-reveal reveal-delay-1">
              <a
                href="https://maps.app.goo.gl/T3FNaykic1zR1GzT8?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="在 Google Maps 查看婚宴地點"
              >
                <img
                  className="invite-map-button"
                  src={asset("openmap-button.png")}
                  alt="打開地圖"
                />
              </a>
            </div>

          </div>

        </section>
        {/* 05｜SAVE THE DATE */}
        <section className="invite-ending">

          {/* 結尾照片 */}
          <img
            className="invite-ending-photo"
            src={asset("theend-photo.png")}
            alt="新人海邊婚紗照"
          />

          {/* 左側標題：滑動進入浮現 */}
          <img
            className="invite-ending-title scroll-reveal"
            src={asset("theend-title.png")}
            alt="Save the Date 2026.12.13"
          />

          {/* 右側操作按鈕：延遲浮現 */}
          <div className="invite-ending-actions scroll-reveal reveal-delay-5">

            {/* 回到頂部 */}
            <button
              type="button"
              className="invite-ending-top"
              onClick={() => {
                setConfettiKey((prev) => prev + 1);

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              aria-label="回到頂部"
            >
              <img src={asset("scrolltotop.png")} alt="" />
            </button>

            {/* 返回首頁 */}
            <button
              type="button"
              className="invite-ending-back"
              onClick={() => navigate("/")}
            >
              ← 返回首頁
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}

export default InvitationPage;
