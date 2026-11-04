
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const BRAND = "ARIRI AI";

const MODEL_CONFIG = {
  seedance20: {
    name: "Seedance 2.0",
    subtitle: "AI Video Generation",
    durations: [5, 10, 15],
    maxDuration: 15,
  },
  seedance25: {
    name: "Seedance 2.5",
    subtitle: "Advanced AI Video Generation",
    durations: [5, 10, 15, 20, 25, 30],
    maxDuration: 30,
  },
};

const NAV_ITEMS = [
  { id: "studio", label: "AI Video Studio", icon: "✦", group: "WORKSPACE" },
  { id: "projects", label: "My Projects", icon: "▧", group: "WORKSPACE" },
  { id: "history", label: "History", icon: "◷", group: "WORKSPACE" },
  { id: "image", label: "Image Generator", icon: "✧", group: "TOOLS" },
  { id: "models", label: "AI Models", icon: "◈", group: "TOOLS" },
];

export default function Home() {
  const [activePage, setActivePage] = useState("studio");
  const [model, setModel] = useState("seedance25");
  const [duration, setDuration] = useState(10);
  const [ratio, setRatio] = useState("16:9");
  const [references, setReferences] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);
  const objectUrls = useRef(new Set());

  const activeModel = MODEL_CONFIG[model];
  const characterCount = prompt.length;
  const canGenerate = prompt.trim().length > 0;

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.current.clear();
    };
  }, []);

  const summary = useMemo(
    () => [
      ["Model", activeModel.name],
      ["Duration", `${duration} seconds`],
      ["Aspect Ratio", ratio],
      ["Reference Images", `${references.length} images`],
    ],
    [activeModel.name, duration, ratio, references.length]
  );

  function changeModel(nextModel) {
    setModel(nextModel);

    const allowed = MODEL_CONFIG[nextModel].durations;

    if (!allowed.includes(duration)) {
      setDuration(allowed[allowed.length - 1]);
    }

    setNotice("");
  }

  function addImages(selectedFiles) {
    const files = Array.from(selectedFiles || []);

    if (!files.length) return;

    const validImages = [];
    const errors = [];

    files.forEach((file) => {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        errors.push(`${file.name}: format tidak didukung`);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: ukuran lebih dari 10 MB`);
        return;
      }

      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);

      validImages.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        url,
      });
    });

    if (validImages.length) {
      setReferences((previous) => [...previous, ...validImages]);
    }

    setNotice(errors.length ? errors.join(" · ") : "");
  }

  function handleFileInput(event) {
    addImages(event.target.files);
    event.target.value = "";
  }

  function removeImage(id) {
    setReferences((previous) => {
      const target = previous.find((item) => item.id === id);

      if (target) {
        URL.revokeObjectURL(target.url);
        objectUrls.current.delete(target.url);
      }

      return previous.filter((item) => item.id !== id);
    });
  }

  function removeAllImages() {
    references.forEach((item) => {
      URL.revokeObjectURL(item.url);
      objectUrls.current.delete(item.url);
    });

    setReferences([]);
    setNotice("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    addImages(event.dataTransfer.files);
  }

  function handleGenerate() {
    if (!canGenerate) {
      setNotice("Masukkan video prompt terlebih dahulu.");
      return;
    }

    setNotice(
      `${activeModel.name} · ${duration} detik · ${ratio} · ${references.length} referensi gambar. Antarmuka siap, tetapi pembuatan video membutuhkan koneksi API provider.`
    );
  }

  function renderStudio() {
    return (
      <>
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              ✦ NEXT GENERATION AI CREATION
            </span>

            <h1>
              Bring your imagination
              <br />
              <span>to life.</span>
            </h1>

            <p>
              Transform your ideas and images into cinematic AI videos.
            </p>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="film film-one" />
            <div className="film film-two" />
            <div className="play-tile">▶</div>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <div className="heading-title">
              <span className="heading-icon">▣</span>
              <h2>Create New Video</h2>
            </div>

            <p>
              Choose a model, add reference images, and describe your video.
            </p>
          </div>

          <span className="model-tag">✦ ARIRI STUDIO</span>
        </div>

        <div className="workspace">
          <div className="left-column">
            <section className="panel">
              <div className="panel-title">
                <span className="step">1</span>
                <h3>Reference Images</h3>
                <span className="optional">UNLIMITED</span>
              </div>

              <div
                className={`upload ${dragging ? "dragging" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="upload-icon">↑</div>
                <h3>Add Reference Images</h3>
                <p>Drag and drop or click to browse</p>
                <span>PNG, JPG, WEBP · MAX 10 MB PER IMAGE</span>
                <small>
                  Add as many reference images as your workflow needs.
                </small>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleFileInput}
                hidden
              />

              <div className="reference-heading">
                <span>
                  Uploaded References ({references.length})
                </span>

                {references.length > 0 && (
                  <button
                    type="button"
                    className="text-action danger"
                    onClick={removeAllImages}
                  >
                    Remove All
                  </button>
                )}
              </div>

              {references.length > 0 ? (
                <div className="reference-grid">
                  {references.map((item, index) => (
                    <div className="reference-card" key={item.id}>
                      <img
                        src={item.url}
                        alt={`Reference ${index + 1}`}
                      />

                      <div className="reference-info">
                        <span>IMAGE {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeImage(item.id)}
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-reference">
                  No reference images uploaded yet.
                </p>
              )}
            </section>

            <section className="panel prompt-panel">
              <div className="panel-title">
                <span className="step">2</span>
                <h3>Video Prompt</h3>
              </div>

              <textarea
                value={prompt}
                maxLength={1000}
                onChange={(event) => {
                  setPrompt(event.target.value);
                  setNotice("");
                }}
                placeholder="Describe your vision... Tell ARIRI AI what should happen in your video."
              />

              <div className="prompt-footer">
                <button
                  type="button"
                  className="text-action"
                  onClick={() =>
                    setPrompt(
                      "A cinematic scene with natural movement, expressive camera work, realistic lighting, and smooth transitions."
                    )
                  }
                >
                  ✨ Use sample prompt
                </button>

                <span>{characterCount}/1000 characters</span>
              </div>
            </section>
          </div>

          <aside className="panel settings-panel">
            <div className="panel-title">
              <span className="step">3</span>
              <h3>Generation Settings</h3>
            </div>

            <div className="setting-group">
              <label className="setting-label">AI Model</label>

              <div className="model-options">
                {Object.entries(MODEL_CONFIG).map(([key, item]) => (
                  <button
                    type="button"
                    key={key}
                    className={`model-option ${
                      model === key ? "selected" : ""
                    }`}
                    onClick={() => changeModel(key)}
                    aria-pressed={model === key}
                  >
                    <span className="model-symbol">✦</span>

                    <span className="model-copy">
                      <strong>{item.name}</strong>
                      <small>{item.subtitle}</small>
                    </span>

                    <span className="radio-dot">
                      {model === key ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-label-row">
                <label className="setting-label">Video Duration</label>
                <span className="limit-label">
                  MAX {activeModel.maxDuration} SEC
                </span>
              </div>

              <div className="duration-grid">
                {activeModel.durations.map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={`choice ${
                      duration === value ? "selected" : ""
                    }`}
                    onClick={() => setDuration(value)}
                    aria-pressed={duration === value}
                  >
                    {value}s
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Aspect Ratio</label>

              <div className="ratio-grid">
                {["16:9", "9:16", "1:1"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={`choice ${
                      ratio === value ? "selected" : ""
                    }`}
                    onClick={() => setRatio(value)}
                    aria-pressed={ratio === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="summary">
              <div className="summary-heading">
                <span className="summary-icon">▤</span>
                <strong>Generation Summary</strong>
              </div>

              {summary.map(([label, value]) => (
                <div className="summary-row" key={label}>
                  <span>{label}</span>
                  <b>{value}</b>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="generate"
              onClick={handleGenerate}
              disabled={!canGenerate}
            >
              ✦ &nbsp; Generate Video <span>➜</span>
            </button>

            {notice && (
              <p className="notice" role="status">
                {notice}
              </p>
            )}

            <p className="disclaimer">
              Video generation requires a connected provider API.
            </p>
          </aside>
        </div>
      </>
    );
  }

  function renderOtherPage() {
    const page = NAV_ITEMS.find((item) => item.id === activePage);

    const descriptions = {
      projects: "Your saved video projects will appear here.",
      history: "Your recent generation activity will appear here.",
      image: "Image generation workspace is ready for provider integration.",
      models: "Explore the available video generation models.",
    };

    return (
      <section className="empty-page panel">
        <span className="empty-icon">{page?.icon || "✦"}</span>

        <h2>{page?.label}</h2>

        <p>{descriptions[activePage]}</p>

        {activePage === "models" && (
          <div className="model-list">
            <div>
              <strong>Seedance 2.0</strong>
              <span>Maximum 15 seconds</span>
            </div>

            <div>
              <strong>Seedance 2.5</strong>
              <span>Maximum 30 seconds</span>
            </div>
          </div>
        )}

        <button
          type="button"
          className="back-button"
          onClick={() => setActivePage("studio")}
        >
          Back to AI Video Studio
        </button>
      </section>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          type="button"
          onClick={() => setActivePage("studio")}
        >
          <span className="logo">A</span>

          <span>
            <strong>{BRAND}</strong>
            <small>CREATIVE STUDIO</small>
          </span>
        </button>

        {["WORKSPACE", "TOOLS"].map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-label">{group}</p>

            {NAV_ITEMS.filter((item) => item.group === group).map(
              (item) => (
                <button
                  type="button"
                  key={item.id}
                  className={`nav-item ${
                    activePage === item.id ? "active" : ""
                  }`}
                  onClick={() => setActivePage(item.id)}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              )
            )}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="pro-card">
            <span>✦ ARIRI STUDIO</span>
            <h3>
              Your creativity,
              <br />
              without limits.
            </h3>
            <p>Make your next idea happen.</p>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <b>ARIRI User</b>
              <small>Personal Workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <b>
              {NAV_ITEMS.find((item) => item.id === activePage)?.label}
            </b>
          </div>

          <div className="system-status">
            <span /> SYSTEM ONLINE
          </div>
        </header>

        <div className="content">
          {activePage === "studio" ? renderStudio() : renderOtherPage()}

          <footer>
            <span>{BRAND} © 2026</span>
            <span>POWERED BY ARTIFICIAL INTELLIGENCE</span>
          </footer>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #080910;
          color: #f5f4fa;
          font-family: Arial, Helvetica, sans-serif;
        }

        button,
        textarea {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .app-shell {
          min-height: 100vh;
          display: flex;
          background: #080910;
        }

        .sidebar {
          width: 245px;
          flex: 0 0 245px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 25px 17px;
          background: #0c0d17;
          border-right: 1px solid #25243a;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 0 4px 42px;
          border: 0;
          background: transparent;
          color: white;
          text-align: left;
          cursor: pointer;
        }

        .logo {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: linear-gradient(135deg, #a98aff, #6736db);
          font-size: 25px;
          font-weight: 900;
          box-shadow: 0 7px 22px #6939cf55;
        }

        .brand strong {
          display: block;
          font-size: 17px;
          letter-spacing: 2px;
        }

        .brand small {
          display: block;
          margin-top: 4px;
          color: #89859e;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .nav-group {
          margin-bottom: 22px;
        }

        .nav-label {
          margin: 0 10px 12px;
          color: #68647f;
          font-size: 10px;
          letter-spacing: 1.6px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 5px;
          border: 1px solid transparent;
          border-radius: 9px;
          color: #aaa7bb;
          background: transparent;
          text-align: left;
          font-size: 12px;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .nav-item span {
          width: 17px;
          color: #b7a0f5;
          text-align: center;
        }

        .nav-item:hover {
          background: #171426;
          color: white;
        }

        .nav-item.active {
          color: #d0bdff;
          background: #25183f;
          border-color: #54358b;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .pro-card {
          padding: 17px;
          border: 1px solid #443166;
          border-radius: 12px;
          background: linear-gradient(140deg, #21163b, #11101c);
        }

        .pro-card span {
          color: #b99bff;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .pro-card h3 {
          font-size: 16px;
          line-height: 1.45;
        }

        .pro-card p {
          color: #9994aa;
          font-size: 10px;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 3px 0;
          font-size: 11px;
        }

        .avatar {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #473071;
        }

        .profile small {
          display: block;
          margin-top: 4px;
          color: #89859b;
          font-size: 9px;
        }

        .main-area {
          min-width: 0;
          flex: 1;
        }

        .topbar {
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 38px;
          border-bottom: 1px solid #242438;
          font-size: 11px;
        }

        .breadcrumb {
          color: #77738e;
        }

        .system-status {
          color: #a6a2b4;
          font-size: 9px;
          letter-spacing: 1.2px;
        }

        .system-status span {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-right: 8px;
          border-radius: 50%;
          background: #48d59b;
          box-shadow: 0 0 10px #48d59b88;
        }

        .content {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          padding: 30px 38px;
        }

        .hero {
          min-height: 205px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          padding: 28px 40px;
          border: 1px solid #3a2a62;
          border-radius: 17px;
          background: radial-gradient(
            ellipse at 83% 45%,
            #4722a7 0%,
            #21123f 35%,
            #11111f 76%
          );
        }

        .eyebrow {
          color: #c1a6ff;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .hero h1 {
          margin: 15px 0 9px;
          font-size: clamp(29px, 3vw, 41px);
          line-height: 1.13;
          letter-spacing: -0.8px;
        }

        .hero h1 span {
          color: #b38bff;
        }

        .hero p {
          color: #bbb5ce;
          font-size: 11px;
        }

        .hero-art {
          position: relative;
          width: 280px;
          height: 155px;
          flex: 0 0 280px;
          display: grid;
          place-items: center;
        }

        .film {
          position: absolute;
          width: 260px;
          height: 75px;
          border: 12px dashed #a48aff44;
          border-radius: 50%;
          transform: rotate(-18deg);
        }

        .film-one {
          top: 20px;
          left: 0;
        }

        .film-two {
          top: 62px;
          left: 20px;
          transform: rotate(18deg);
        }

        .play-tile {
          z-index: 1;
          width: 105px;
          height: 105px;
          display: grid;
          place-items: center;
          border: 2px solid #d6c4ff;
          border-radius: 25px;
          color: white;
          font-size: 38px;
          background: linear-gradient(
            145deg,
            #bd9aff,
            #5b20dc 65%,
            #28105f
          );
          box-shadow: 0 0 45px #a879ff99;
          transform: rotate(9deg);
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin: 30px 0 17px;
        }

        .heading-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .heading-icon {
          color: #a77bff;
          font-size: 25px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 20px;
        }

        .section-heading p {
          margin: 6px 0 0 37px;
          color: #89859b;
          font-size: 11px;
        }

        .model-tag {
          padding: 9px 12px;
          border: 1px solid #53358a;
          border-radius: 8px;
          color: #d0baff;
          background: #211735;
          font-size: 9px;
          letter-spacing: 0.5px;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(310px, 1fr);
          gap: 18px;
          align-items: start;
        }

        .left-column {
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .panel {
          min-width: 0;
          padding: 21px;
          border: 1px solid #29283b;
          border-radius: 13px;
          background: #10111d;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .panel-title h3 {
          margin: 0;
          font-size: 13px;
        }

        .step {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg, #8652e9, #5422ad);
          font-size: 11px;
          font-weight: bold;
        }

        .optional {
          margin-left: auto;
          color: #b99bff;
          font-size: 9px;
          letter-spacing: 1px;
        }

        .upload {
          min-height: 175px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border: 1px dashed #554477;
          border-radius: 10px;
          background: #171526;
          cursor: pointer;
          text-align: center;
          transition: 0.2s;
        }

        .upload:hover,
        .upload.dragging {
          border-color: #ae8aff;
          background: #211936;
        }

        .upload-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #c6adff;
          background: #30244a;
          font-size: 23px;
        }

        .upload h3 {
          margin: 12px 0 5px;
          font-size: 13px;
        }

        .upload p {
          color: #a09bb0;
          font-size: 11px;
        }

        .upload span {
          color: #77738a;
          font-size: 9px;
        }

        .upload small {
          margin-top: 10px;
          color: #a88cdb;
          font-size: 9px;
        }

        .reference-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 20px;
          color: #c6c0d4;
          font-size: 11px;
        }

        .reference-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 10px;
          margin-top: 13px;
        }

        .reference-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid #39334d;
          border-radius: 9px;
          background: #171624;
        }

        .reference-card img {
          display: block;
          width: 100%;
          height: 115px;
          object-fit: cover;
        }

        .reference-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          padding: 7px;
        }

        .reference-info span {
          overflow: hidden;
          color: #aaa4bb;
          font-size: 8px;
          text-overflow: ellipsis;
        }

        .reference-info button {
          width: 21px;
          height: 21px;
          flex: 0 0 21px;
          border: 0;
          border-radius: 5px;
          color: #ff9baf;
          background: #39202c;
          cursor: pointer;
          font-size: 16px;
        }

        .empty-reference {
          margin: 13px 0 0;
          color: #77738a;
          font-size: 10px;
        }

        .text-action {
          padding: 0;
          border: 0;
          color: #b99bff;
          background: transparent;
          font-size: 10px;
          cursor: pointer;
        }

        .text-action:hover {
          color: white;
        }

        .text-action.danger {
          color: #ff9baf;
        }

        .prompt-panel textarea {
          width: 100%;
          min-height: 155px;
          resize: vertical;
          padding: 15px;
          border: 1px solid #37344b;
          border-radius: 9px;
          outline: none;
          color: white;
          background: #0b0c15;
          font-size: 12px;
          line-height: 1.7;
        }

        .prompt-panel textarea:focus {
          border-color: #9771e8;
        }

        .prompt-panel textarea::placeholder {
          color: #716d82;
        }

        .prompt-footer {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
          color: #77738a;
          font-size: 10px;
        }

        .settings-panel {
          position: sticky;
          top: 15px;
        }

        .setting-group {
          margin-top: 24px;
        }

        .setting-label {
          display: block;
          margin-bottom: 11px;
          color: #ddd9e9;
          font-size: 12px;
        }

        .setting-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .limit-label {
          color: #b99bff;
          font-size: 9px;
        }

        .model-options {
          display: grid;
          gap: 9px;
        }

        .model-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border: 1px solid #353247;
          border-radius: 9px;
          color: white;
          background: #171624;
          text-align: left;
          cursor: pointer;
        }

        .model-option.selected {
          border-color: #9065df;
          background: #241a38;
        }

        .model-symbol {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #d9c8ff;
          background: #3a2860;
          font-size: 17px;
        }

        .model-copy {
          flex: 1;
        }

        .model-copy strong {
          display: block;
          font-size: 11px;
        }

        .model-copy small {
          display: block;
          margin-top: 4px;
          color: #9690a8;
          font-size: 9px;
        }

        .radio-dot {
          width: 19px;
          height: 19px;
          display: grid;
          place-items: center;
          border: 1px solid #5b526f;
          border-radius: 50%;
          color: white;
          font-size: 10px;
        }

        .selected .radio-dot {
          border-color: #9e72f2;
          background: #8549e8;
        }

        .duration-grid,
        .ratio-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
        }

        .choice {
          min-height: 38px;
          padding: 8px 5px;
          border: 1px solid #39364e;
          border-radius: 8px;
          color: #aaa6b8;
          background: #171724;
          font-size: 10px;
          cursor: pointer;
          transition: 0.16s ease;
        }

        .choice:hover {
          border-color: #9168e5;
          color: white;
        }

        .choice.selected {
          border-color: #a16eff;
          color: white;
          background: linear-gradient(110deg, #5a20cb, #8d43ed);
          box-shadow: 0 4px 15px #7135d544;
        }

        .summary {
          margin-top: 23px;
          padding: 13px;
          border: 1px solid #2e2b43;
          border-radius: 9px;
          background: #0b0c15;
        }

        .summary-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 10px;
        }

        .summary-icon {
          color: #b89aff;
          font-size: 15px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 6px 0;
          font-size: 10px;
        }

        .summary-row span {
          color: #89859b;
        }

        .summary-row b {
          color: #f1eef8;
          font-weight: 500;
          text-align: right;
        }

        .generate {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 17px;
          padding: 14px;
          border: 0;
          border-radius: 9px;
          color: white;
          background: linear-gradient(100deg, #6e2be0, #a04ff0);
          box-shadow: 0 5px 20px #7949d544;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .generate:hover:not(:disabled) {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .generate:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .notice {
          margin: 11px 0 0;
          padding: 10px;
          border: 1px solid #70572f;
          border-radius: 7px;
          color: #f1d49a;
          background: #241d12;
          font-size: 10px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .disclaimer {
          margin: 11px 0 0;
          color: #716d82;
          font-size: 8px;
          line-height: 1.5;
          text-align: center;
        }

        .empty-page {
          min-height: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-icon {
          color: #b18aff;
          font-size: 38px;
        }

        .empty-page h2 {
          margin: 14px 0 5px;
        }

        .empty-page p {
          color: #9690a8;
          font-size: 12px;
        }

        .model-list {
          width: min(100%, 400px);
          margin: 15px 0;
        }

        .model-list div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 12px;
          border-bottom: 1px solid #343047;
          font-size: 11px;
        }

        .model-list span {
          color: #b99bff;
        }

        .back-button {
          margin-top: 15px;
          padding: 11px 16px;
          border: 1px solid #7650b4;
          border-radius: 8px;
          color: white;
          background: #2a1b45;
          cursor: pointer;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 30px;
          padding-top: 17px;
          border-top: 1px solid #29283b;
          color: #77738a;
          font-size: 8px;
          letter-spacing: 1px;
        }

        @media (max-width: 1050px) {
          .sidebar {
            width: 205px;
            flex-basis: 205px;
          }

          .content {
            padding: 25px 22px;
          }

          .workspace {
            grid-template-columns: minmax(0, 1.2fr) minmax(290px, 1fr);
          }

          .hero-art {
            width: 190px;
            flex-basis: 190px;
          }
        }

        @media (max-width: 800px) {
          .sidebar {
            width: 72px;
            flex-basis: 72px;
            padding: 20px 9px;
          }

          .brand {
            justify-content: center;
            padding: 0 0 35px;
          }

          .brand > span:last-child,
          .nav-label,
          .nav-item:not(.active) {
            display: none;
          }

          .nav-item {
            justify-content: center;
            padding: 13px 5px;
            font-size: 0;
          }

          .nav-item span {
            font-size: 17px;
          }

          .pro-card,
          .profile {
            display: none;
          }

          .workspace {
            grid-template-columns: 1fr;
          }

          .settings-panel {
            position: static;
          }

          .hero-art {
            display: none;
          }
        }

        @media (max-width: 560px) {
          .sidebar {
            display: none;
          }

          .topbar {
            height: 58px;
            padding: 0 15px;
          }

          .content {
            padding: 18px 13px;
          }

          .hero {
            min-height: 180px;
            padding: 22px;
          }

          .hero h1 {
            font-size: 29px;
          }

          .section-heading {
            align-items: flex-start;
          }

          .section-heading h2 {
            font-size: 17px;
          }

          .model-tag {
            font-size: 8px;
          }

          .panel {
            padding: 16px;
          }

          .reference-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          footer {
            font-size: 7px;
          }
        }
      `}</style>
    </main>
  );
}
