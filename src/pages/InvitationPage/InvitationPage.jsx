
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./InvitationPage.scss";
import { useNavigate, useLocation } from "react-router-dom";
import KvConfetti from "../../components/KvConfetti";

// GitHub Pages 相容路徑
const BASE = `${import.meta.env.BASE_URL}assets/invitation/`;
const RSVP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfh4LjzgMD1_iZHw2X167W8QQbE0ccfhq9ZSveFud6TfXDB7inK1v0TpsIx_xCcKM/exec";
const WELCOME_BASE = `${import.meta.env.BASE_URL}assets/welcome/`;


const asset = (name) => `${BASE}${name}`;
const endingPhotos = [
  "theend-photo-1.png",
  "theend-photo-2.png",
  "theend-photo-3.png",
  "theend-photo-4.png",
  "theend-photo-5.png",
];


function InvitationPage({ isPlaying, toggleMusic }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [confettiKey, setConfettiKey] = useState(0);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    name: "",
    attendance: "yes",
    headcount: "1",
    otherHeadcount: "",
    note: "",
  });

  const [rsvpStatus, setRsvpStatus] = useState("idle");
  const pageRef = useRef(null);
  const handleRsvpSubmit = (e) => {
    e.preventDefault();

    const count =
      rsvpForm.attendance === "no"
        ? ""
        : rsvpForm.headcount === "其他"
          ? Number(rsvpForm.otherHeadcount)
          : Number(rsvpForm.headcount);

    if (!rsvpForm.name.trim()) {
      alert("請輸入姓名");
      return;
    }

    if (
      rsvpForm.attendance === "yes" &&
      rsvpForm.headcount === "其他" &&
      (!Number.isInteger(count) || count < 11)
    ) {
      alert("其他人數請輸入 11 人以上的整數");
      return;
    }

    setRsvpStatus("sending");

    const callbackName = `rsvpCallback_${Date.now()}`;
    const script = document.createElement("script");
    let finished = false;
    let timeout;

    const cleanup = () => {
      if (finished) return;
      finished = true;
      delete window[callbackName];
      script.remove();
      clearTimeout(timeout);
    };

    window[callbackName] = (result) => {
      cleanup();
      setRsvpStatus(result.success ? "success" : "error");
    };

    script.onerror = () => {
      cleanup();
      setRsvpStatus("error");
    };

    const params = new URLSearchParams({
      callback: callbackName,
      name: rsvpForm.name.trim(),
      attendance: rsvpForm.attendance,
      headcount: String(count),
      note: rsvpForm.note.trim(),
    });

    script.src = `${RSVP_SCRIPT_URL}?${params.toString()}`;

    timeout = setTimeout(() => {
      cleanup();
      setRsvpStatus("error");
    }, 20000);

    document.body.appendChild(script);
  };
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
        "--sky-background": `url("${window.location.origin}${import.meta.env.BASE_URL}assets/welcome/background-sky.png")`,
        "--paper-background": `url("${window.location.origin}${import.meta.env.BASE_URL}assets/invitation/paper-bg.png")`,
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
              <img src={asset("part-2-photo-4.png")} alt="新人婚紗照" />

              {/* 重複一次，確保無縫循環 */}
              <img src={asset("part-2-photo-1.png")} alt="" aria-hidden="true" />
              <img src={asset("part-2-photo-2.png")} alt="" aria-hidden="true" />
              <img src={asset("part-2-photo-3.png")} alt="" aria-hidden="true" />
              <img src={asset("part-2-photo-4.png")} alt="" aria-hidden="true" />
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
            {/* 交通資訊按鈕：移至地點資訊區塊底部 */}
            <div className="invite-location-transport-wrap scroll-reveal reveal-delay-1">
              <button
                type="button"
                className="invite-transport-trigger"
                onClick={() => setShowTransportModal(true)}
                aria-label="查看交通資訊"
              >
                <img
                  className="invite-map-button"
                  src={asset("transport-info-button.png")}
                  alt="交通資訊"
                />
              </button>
            </div>

          </div>

          {/* 場地照片 */}
          <img
            className="invite-location-photo"
            src={asset("location-photo.png")}
            alt="婚禮場地照片"
          />



          {/* ========================================
    交通資訊彈窗
======================================== */}
          {showTransportModal && createPortal(
            <div
              className="invite-transport-modal"
              onClick={() => setShowTransportModal(false)}
            >
              {/* 背景遮罩 */}
              <div className="invite-transport-backdrop" />

              {/* 彈窗內容 */}
              <div
                className="invite-transport-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="transport-modal-title"
                onClick={(e) => e.stopPropagation()}
              >

                {/* 關閉叉叉 */}
                <button
                  type="button"
                  className="invite-transport-close"
                  onClick={() => setShowTransportModal(false)}
                  aria-label="關閉交通資訊"
                >
                  ×
                </button>



                {/* 捷運資訊 */}
                <div className="invite-transport-section">
                  <h3>
                    <img src={asset("location-flower2.png")} alt="" />
                    捷運資訊
                  </h3>

                  <p>
                    搭乘文湖線
                    <span className="transport-arrow">▸</span>
                    捷運「劍南路站」下車
                    <span className="transport-arrow">▸</span>
                    2 號出口
                    <span className="transport-arrow">▸</span>
                    步行約 1 分鐘抵達
                  </p>
                </div>

                {/* 公車資訊 */}
                <div className="invite-transport-section">
                  <h3>
                    <img src={asset("location-flower2.png")} alt="" />
                    公車資訊
                  </h3>

                  <p>▸ 於「捷運劍南路站」下車</p>
                  <p>▸ 以下路線可搭乘抵達</p>

                  <div className="invite-bus-routes">
                    28、33、72、208、222、287、247、256、267、268、286、
                    620、646、902、556、683、681、957、955、1801、1573、
                    紅2、紅3、棕20、藍7、藍20(區)、藍26、綠16、內湖幹線
                  </div>
                </div>

                {/* 打開地圖按鈕 */}
                <a
                  className="invite-transport-map-link"
                  href="https://maps.app.goo.gl/T3FNaykic1zR1GzT8?g_st=ic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="在 Google Maps 查看婚宴地點"
                >
                  <img
                    src={asset("openmap-button.png")}
                    alt="打開地圖"
                  />
                </a>

              </div>
            </div>
            , document.body)}

        </section>

        {/* 05｜RSVP 回覆出席意願 */}
        <section className="invite-rsvp">
          <img
            className="invite-rsvp-bg"
            src={asset("RSVP-bg-tt.png")}
            alt=""
          />

          <button
            type="button"
            className="invite-rsvp-trigger"
            onClick={() => setShowRsvpModal(true)}
            aria-label="回覆出席意願"
          >
            <img
              src={asset("RSVP-button.png")}
              alt="回覆出席意願"
            />
          </button>
        </section>
        {/* ========================================
            RSVP FORM MODAL
        ======================================== */}
        {showRsvpModal && createPortal(
          <div
            className="invite-transport-modal"
            onClick={() => setShowRsvpModal(false)}
          >
            {/* 背景遮罩：沿用交通資訊 Modal */}
            <div className="invite-transport-backdrop" />

            {/* 表單視窗：沿用交通資訊 Modal */}
            <div
              className="invite-transport-panel invite-rsvp-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rsvp-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 關閉按鈕：沿用交通資訊 Modal */}
              <button
                type="button"
                className="invite-transport-close"
                onClick={() => setShowRsvpModal(false)}
                aria-label="關閉表單"
              >
                ×
              </button>

              {rsvpStatus === "success" ? (
                /* 送出成功 */
                <div className="invite-rsvp-success">
                  <h2>感謝您的回覆！</h2>

                  <p>
                    期待與您一同見證重要時刻
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setShowRsvpModal(false);
                      setRsvpStatus("idle");

                      setRsvpForm({
                        name: "",
                        attendance: "yes",
                        headcount: "1",
                        otherHeadcount: "",
                        note: "",
                      });
                    }}
                  >
                    完成
                  </button>
                </div>
              ) : (
                <>


                  <form
                    className="invite-rsvp-form"
                    onSubmit={handleRsvpSubmit}
                  >
                    {/* 姓名 */}
                    <div className="invite-rsvp-field">
                      <label
                        className="invite-rsvp-label"
                        htmlFor="rsvp-name"
                      >
                        姓名
                        <span className="required-mark">*</span>
                      </label>

                      <input
                        id="rsvp-name"
                        type="text"
                        required
                        value={rsvpForm.name}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="請輸入姓名"
                      />
                    </div>

                    {/* 出席意願 */}
                    <div className="invite-rsvp-field">
                      <div className="invite-rsvp-label">
                        出席意願
                        <span className="required-mark">*</span>
                      </div>

                      <div className="invite-rsvp-attendance">

                        {/* 會出席 */}
                        <label
                          className={`invite-rsvp-choice ${rsvpForm.attendance === "yes"
                              ? "active"
                              : ""
                            }`}
                        >
                          <input
                            type="radio"
                            name="attendance"
                            value="yes"
                            checked={rsvpForm.attendance === "yes"}
                            onChange={() =>
                              setRsvpForm({
                                ...rsvpForm,
                                attendance: "yes",
                              })
                            }
                          />

                          <span className="invite-rsvp-choice-icon">
  <img src={asset("blue-heart.png")} alt="" />
</span>

                          <span>會出席</span>
                        </label>

                        {/* 無法出席 */}
                        <label
                          className={`invite-rsvp-choice ${rsvpForm.attendance === "no"
                              ? "active"
                              : ""
                            }`}
                        >
                          <input
                            type="radio"
                            name="attendance"
                            value="no"
                            checked={rsvpForm.attendance === "no"}
                            onChange={() =>
                              setRsvpForm({
                                ...rsvpForm,
                                attendance: "no",
                              })
                            }
                          />

                          <span className="invite-rsvp-choice-icon">
                            ×
                          </span>

                          <span>無法出席</span>
                        </label>

                      </div>
                    </div>

                    {/* 出席人數 */}
                    {rsvpForm.attendance === "yes" && (
                      <div className="invite-rsvp-field">
                        <label
                          className="invite-rsvp-label"
                          htmlFor="rsvp-headcount"
                        >
                          出席人數（包含您本人）
                          <span className="required-mark">*</span>
                        </label>

                        <select
                          id="rsvp-headcount"
                          value={rsvpForm.headcount}
                          onChange={(e) =>
                            setRsvpForm({
                              ...rsvpForm,
                              headcount: e.target.value,
                              otherHeadcount: "",
                            })
                          }
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option
                              key={i + 1}
                              value={String(i + 1)}
                            >
                              {i + 1} 人
                            </option>
                          ))}

                          <option value="其他">
                            其他（11 人以上）
                          </option>
                        </select>
                      </div>
                    )}

                    {/* 其他人數 */}
                    {rsvpForm.attendance === "yes" &&
                      rsvpForm.headcount === "其他" && (
                        <div className="invite-rsvp-field">
                          <label
                            className="invite-rsvp-label"
                            htmlFor="rsvp-other-count"
                          >
                            請輸入出席人數
                            <span className="required-mark">*</span>
                          </label>

                          <input
                            id="rsvp-other-count"
                            type="number"
                            min="11"
                            step="1"
                            required
                            value={rsvpForm.otherHeadcount}
                            onChange={(e) =>
                              setRsvpForm({
                                ...rsvpForm,
                                otherHeadcount: e.target.value,
                              })
                            }
                            placeholder="請輸入 11 人以上的人數"
                          />
                        </div>
                      )}

                    {/* 備註 */}
                    <div className="invite-rsvp-field">
                      <label
                        className="invite-rsvp-label"
                        htmlFor="rsvp-note"
                      >
                        備註
                        <span className="optional-mark">選填</span>
                      </label>

                      <textarea
                        id="rsvp-note"
                        rows="3"
                        value={rsvpForm.note}
                        onChange={(e) =>
                          setRsvpForm({
                            ...rsvpForm,
                            note: e.target.value,
                          })
                        }
                        placeholder="有想告訴新人的話，可以寫在這裡"
                      />
                    </div>

                    {/* 錯誤提示 */}
                    {rsvpStatus === "error" && (
                      <p className="invite-rsvp-error">
                        送出失敗，請稍後再試。
                      </p>
                    )}

                    {/* 送出按鈕 */}
                    <button
                      type="submit"
                      className="invite-rsvp-submit"
                      disabled={rsvpStatus === "sending"}
                    >
                      {rsvpStatus === "sending"
                        ? "送出中…"
                        : "送出回覆"}
                    </button>

                  </form>
                </>
              )}

            </div>
          </div>
          , document.body)}
        {/* 05｜SAVE THE DATE */}
        <section className="invite-ending">

          {/* 輪播照片：底層 */}
          <img
            className="invite-ending-photo"
            src={asset(endingPhotos[0])}
            alt=""
            aria-hidden="true"
          />

          <div className="invite-ending-carousel">
            <div className="invite-ending-track">
              {[...endingPhotos, ...endingPhotos].map((photo, index) => (
                <img
                  key={index}
                  src={asset(photo)}
                  alt=""
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Save the Date 標題 */}
          <img
            className="invite-ending-title scroll-reveal"
            src={asset("theend-title.png")}
            alt="Save the Date 2026.12.13"
          />

          {/* 操作按鈕 */}
          <div className="invite-ending-actions scroll-reveal reveal-delay-5">

            <button
              type="button"
              className="invite-ending-top"
              onClick={() => {
                setConfettiKey((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label="回到頂部"
            >
              <img src={asset("scrolltotop.png")} alt="" />
            </button>

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
