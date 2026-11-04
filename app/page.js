"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const activeModel = MODEL_CONFIG[model];
  const characterCount = prompt.length;
  const canGenerate = prompt.trim().length > 0;

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const summary = useMemo(
    () => [
      ["Model", activeModel.name],
      ["Duration", `${duration} seconds`],
      ["Aspect ratio", ratio],
      ["Reference image", file ? "Uploaded" : "None"],
    ],
    [activeModel.name, duration, ratio, file]
  );

  function changeModel(nextModel) {
    setModel(nextModel);
    const allowed = MODEL_CONFIG[nextModel].durations;
    if (!allowed.includes(duration)) setDuration(allowed[allowed.length - 1]);
    setNotice("");
  }

  function acceptFile(selected) {
    if (!selected) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(selected.type)) {
      setNotice("Please choose a PNG, JPG, or WEBP image.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setNotice("Image size must be 10 MB or less.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setNotice("");
  }

  function handleFileInput(event) {
    acceptFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function removeImage() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setNotice("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  function handleGenerate() {
    if (!canGenerate) {
      setNotice("Write a video prompt before continuing.");
      return;
    }

    setNotice(
      `${activeModel.name} selected · ${duration} seconds · ${ratio}. The interface is ready, but video generation needs a connected provider API.`
    );
  }

  function renderStudio() {
    return (
      <>
        <div className="hero">
          <div className="hero-copy">
            <span className="eyebrow">✦ NEXT GENERATION AI CREATION</span>
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
              Choose a model, set the duration, and describe your video.
            </p>
          </div>
          <span className="model-tag">✦ SEEDANCE STUDIO</span>
        </div>

        <div className="workspace">
          <div className="left-column">
            <section className="panel">
              <div className="panel-title">
                <span className="step">1</span>
                <h3>Reference Image</h3>
                <span className="optional">OPTIONAL</span>
              </div>

              <div
                className={`upload ${dragging ? "dragging" : ""} ${
                  preview ? "has-preview" : ""
                }`}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="preview-wrap">
                    <img
                      src={preview}
                      alt="Reference preview"
                      className="preview"
                    />
                    <div className="preview-actions">
                      <span>{file?.name}</span>
                      <button
                        type="button"
                        className="remove-image"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeImage();
                        }}
                      >
                        Remove image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">↑</div>
                    <h3>Upload your image</h3>
                    <p>Drag and drop or click to browse</p>
                    <span>PNG, JPG, WEBP · MAX 10 MB</span>
                  </>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileInput}
                hidden
              />
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
                placeholder="Describe your vision... Tell PRIME AI what should happen in your video."
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
              Video generation requires a valid provider API connection.
            </p>
          </aside>
        </div>
      </>
    );
  }

  function renderOtherPage() {
    const page = NAV_ITEMS.find(
      (item) => item.id === activePage
    );

    const descriptions = {
      projects: "Your saved video projects will appear here.",
      history: "Your recent generation activity will appear here.",
      image: "Image generation workspace is ready for a future provider connection.",
      models: "Choose from the available video models in the AI Video Studio.",
    };

    return (
      <section className="empty-page panel">
        <span className="empty-icon">
          {page?.icon || "✦"}
        </span>

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
          <span className="logo">P</span>

          <span>
            <strong>PRIME AI</strong>
            <small>CREATIVE STUDIO</small>
          </span>
        </button>

        {["WORKSPACE", "TOOLS"].map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-label">{group}</p>

            {NAV_ITEMS.filter(
              (item) => item.group === group
            ).map((item) => (
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
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="pro-card">
            <span>✦ PRIME STUDIO</span>
            <h3>
              Your creativity,
              <br />
              without limits.
            </h3>
            <p>Make your next idea happen.</p>
          </div>

          <div className="profile">
            <div className="avatar">P</div>

            <div>
              <b>Prime User</b>
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
              {
                NAV_ITEMS.find(
                  (item) => item.id === activePage
                )?.label
              }
            </b>
          </div>

          <div className="system-status">
            <span />
            SYSTEM ONLINE
          </div>
        </header>

        <div className="content">
          {activePage === "studio"
            ? renderStudio()
            : renderOtherPage()}

          <footer>
            <span>PRIME AI © 2026</span>
            <span>POWERED BY ARTIFICIAL INTELLIGENCE</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
      <style jsx global>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #080910;
          color: #f5f4fa;
          font-family: Arial, Helvetica, sans-serif;
        }

        button, textarea { font: inherit; }
        button { -webkit-tap-highlight-color: transparent; }

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
          background: linear-gradient(135deg,#a98aff,#6736db);
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

        .nav-group { margin-bottom: 22px; }

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
          transition: .18s ease;
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

        .sidebar-bottom { margin-top: auto; }

        .pro-card {
          padding: 17px;
          border: 1px solid #443166;
          border-radius: 12px;
          background: linear-gradient(140deg,#21163b,#11101c);
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

        .breadcrumb { color: #77738e; }

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
          font-size: clamp(29px,3vw,41px);
          line-height: 1.13;
          letter-spacing: -.8px;
        }

        .hero h1 span { color: #b38bff; }
        .hero p { color: #bbb5ce; font-size: 11px; }

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

        .film-one { top: 20px; left: 0; }

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
          letter-spacing: .5px;
          white-space: nowrap;
        }

        .workspace {
          display: grid;
          grid-template-columns: minmax(0,1.55fr) minmax(340px,1fr);
          align-items: start;
          gap: 17px;
        }

        .left-column {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .panel {
          min-width: 0;
          padding: 21px;
          border: 1px solid #2d2b43;
          border-radius: 14px;
          background: #10111d;
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 17px;
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
          background: linear-gradient(135deg,#8f36ff,#5b13d4);
          font-size: 11px;
          font-weight: bold;
        }

        .optional {
          margin-left: auto;
          color: #77738b;
          font-size: 8px;
          letter-spacing: 1px;
        }

        .upload {
          min-height: 175px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px dashed #66518d;
          border-radius: 10px;
          background: #171526;
          cursor: pointer;
          transition: .18s ease;
        }

        .upload:hover,
        .upload.dragging {
          border-color: #b18aff;
          background: #201832;
        }

        .upload-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #d4c0ff;
          background: #352354;
          font-size: 24px;
        }

        .upload h3 {
          margin: 11px 0 3px;
          font-size: 12px;
        }

        .upload p {
          margin: 4px 0 9px;
          color: #aaa4ba;
          font-size: 10px;
        }

        .upload > span {
          color: #77738b;
          font-size: 8px;
          letter-spacing: .5px;
        }

        .preview-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px;
        }

        .preview {
          max-width: 100%;
          max-height: 220px;
          object-fit: contain;
          border-radius: 7px;
        }

        .preview-actions {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 10px;
          color: #9ce0bd;
          font-size: 10px;
        }

        .preview-actions span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .remove-image {
          padding: 7px 9px;
          border: 1px solid #65404e;
          border-radius: 6px;
          color: #ffc2cb;
          background: #2a1721;
          font-size: 9px;
          cursor: pointer;
        }

        .prompt-panel textarea {
          width: 100%;
          min-height: 145px;
          resize: vertical;
          padding: 14px;
          border: 1px solid #39364e;
          border-radius: 9px;
          outline: none;
          color: white;
          background: #0b0c15;
          font-size: 11px;
          line-height: 1.7;
        }

        .prompt-panel textarea:focus {
          border-color: #9c72ed;
          box-shadow: 0 0 0 2px #9c72ed22;
        }

        .prompt-panel textarea::placeholder { color: #77738a; }

        .prompt-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 9px;
          color: #77738a;
          font-size: 9px;
        }

        .text-action {
          padding: 0;
          border: 0;
          color: #b795ff;
          background: transparent;
          font-size: 10px;
          cursor: pointer;
        }

        .text-action:hover { color: white; }

        .settings-panel { padding: 21px; }

        .setting-group { margin-top: 23px; }

        .setting-label {
          display: block;
          margin-bottom: 10px;
          color: #e0ddeb;
          font-size: 11px;
          font-weight: 600;
        }

        .setting-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .limit-label {
          margin-bottom: 10px;
          color: #b99bff;
          font-size: 8px;
          letter-spacing: .8px;
        }

        .model-options {
          display: grid;
          gap: 8px;
        }

        .model-option {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px;
          border: 1px solid #37334b;
          border-radius: 9px;
          color: #eae7f3;
          background: #171725;
          text-align: left;
          cursor: pointer;
          transition: .18s ease;
        }

        .model-option:hover { border-color: #8560c5; }

        .model-option.selected {
          border-color: #9566ed;
          background: #241a3a;
          box-shadow: inset 0 0 0 1px #9566ed33;
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

        .model-copy { flex: 1; }

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
          grid-template-columns: repeat(3,minmax(0,1fr));
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
          transition: .16s ease;
        }

        .choice:hover {
          border-color: #9168e5;
          color: white;
        }

        .choice.selected {
          border-color: #a16eff;
          color: white;
          background: linear-gradient(110deg,#5a20cb,#8d43ed);
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

        .summary-row span { color: #89859b; }

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
          background: linear-gradient(100deg,#6e2be0,#a04ff0);
          box-shadow: 0 5px 20px #7949d544;
          font-size: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: .18s ease;
        }

        .generate:hover:not(:disabled) {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        .generate:disabled {
          opacity: .45;
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

        .empty-page h2 { margin: 14px 0 5px; }

        .empty-page p {
          color: #9690a8;
          font-size: 12px;
        }

        .model-list {
          width: min(100%,400px);
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

        .model-list span { color: #b99bff; }

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

        @media(max-width:1050px) {
          .sidebar {
            width: 205px;
            flex-basis: 205px;
          }

          .content { padding: 25px 22px; }

          .workspace {
            grid-template-columns: minmax(0,1.2fr) minmax(310px,1fr);
          }

          .hero-art {
            width: 190px;
            flex-basis: 190px;
          }
        }

        @media(max-width:800px) {
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

          .nav-item span { font-size: 17px; }

          .pro-card,
          .profile {
            display: none;
          }

          .workspace { grid-template-columns: 1fr; }
          .hero-art { display: none; }
        }

        @media(max-width:560px) {
          .sidebar { display: none; }

          .topbar {
            height: 58px;
            padding: 0 15px;
          }

          .content { padding: 18px 13px; }
          .hero { min-height: 180px; padding: 22px; }
          .hero h1 { font-size: 29px; }
          .section-heading { align-items: flex-start; }
          .section-heading h2 { font-size: 17px; }
          .model-tag { font-size: 8px; }
          .panel { padding: 16px; }
          footer { font-size: 7px; }
        }
      `}</style>
    </main>
  );
}
