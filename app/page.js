
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const MODELS = {
  seedance20: {
    name: "Seedance 2.0",
    description: "AI Video Generation",
    durations: [5, 10, 15],
    max: 15,
  },
  seedance25: {
    name: "Seedance 2.5",
    description: "Advanced AI Video Generation",
    durations: [5, 10, 15, 20, 25, 30],
    max: 30,
  },
};

const NAVIGATION = [
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
  const inputRef = useRef(null);

  const activeModel = MODELS[model];

  const summary = useMemo(() => [
    ["AI Model", activeModel.name],
    ["Duration", duration + " seconds"],
    ["Aspect Ratio", ratio],
    ["Reference", file ? "Uploaded" : "None"],
  ], [activeModel, duration, ratio, file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function changeModel(value) {
    setModel(value);
    const allowed = MODELS[value].durations;
    if (!allowed.includes(duration)) {
      setDuration(allowed[allowed.length - 1]);
    }
    setNotice("");
  }

  function acceptFile(selected) {
    if (!selected) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(selected.type)) {
      setNotice("Gunakan gambar PNG, JPG, atau WEBP.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setNotice("Ukuran gambar maksimal 10 MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setNotice("");
  }

  function removeImage() {
    setFile(null);
    setPreview("");
  }

  function handleGenerate() {
    if (!prompt.trim()) {
      setNotice("Masukkan prompt video terlebih dahulu.");
      return;
    }

    setNotice(
      "Pengaturan siap: " + activeModel.name + ", " +
      duration + " detik, " + ratio +
      ". Hubungkan API penyedia video untuk mulai generate."
    );
  }

  function renderStudio() {
    return (
      <>
        <div className="hero">
          <div>
            <span className="eyebrow">✦ NEXT GENERATION AI CREATION</span>
            <h1>
              Bring your imagination
              <br />
              <span>to life.</span>
            </h1>
            <p>Transform your ideas and images into cinematic AI videos.</p>
          </div>

          <div className="hero-art">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="hero-logo">✦</div>
          </div>
        </div>

        <div className="section-heading">
          <div>
            <h2>✦ Create New Video</h2>
            <p>Configure your generation settings below.</p>
          </div>
          <span className="tag">✦ PRIME STUDIO</span>
        </div>

        <div className="workspace">
          <div className="left-column">
            <section className="panel">
              <div className="panel-title">
                <span className="step">01</span>
                <h3>REFERENCE IMAGE</h3>
                <span className="optional">OPTIONAL</span>
              </div>

              <div
                className={"upload " + (dragging ? "dragging " : "") + (preview ? "has-preview" : "")}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  acceptFile(e.dataTransfer.files?.[0]);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
              >
                {preview ? (
                  <div className="preview-wrap">
                    <img src={preview} alt="Reference image" />
                    <div className="preview-info">
                      <span>{file?.name}</span>
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon">↑</div>
                    <h3>Upload your image</h3>
                    <p>Drag and drop or browse your files</p>
                    <small>PNG, JPG, WEBP · MAX 10 MB</small>
                  </>
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => {
                  acceptFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </section>

            <section className="panel">
              <div className="panel-title">
                <span className="step">02</span>
                <h3>VIDEO PROMPT</h3>
              </div>

              <textarea
                value={prompt}
                maxLength={1000}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setNotice("");
                }}
                placeholder="Describe your vision... Tell PRIME AI what should happen in your video."
              />

              <div className="prompt-footer">
                <button
                  type="button"
                  className="sample-btn"
                  onClick={() => setPrompt(
                    "A cinematic scene with natural movement, expressive camera work, realistic lighting and smooth transitions."
                  )}
                >
                  ✨ Use sample prompt
                </button>
                <span>{prompt.length}/1000 characters</span>
              </div>
            </section>
          </div>

          <aside className="panel settings">
            <div className="panel-title">
              <span className="step">03</span>
              <h3>GENERATION SETTINGS</h3>
            </div>

            <div className="setting-group">
              <label>AI Model</label>

              {Object.entries(MODELS).map(([key, item]) => (
                <button
                  type="button"
                  key={key}
                  className={"model-option " + (model === key ? "selected" : "")}
                  onClick={() => changeModel(key)}
                  aria-pressed={model === key}
                >
                  <span className="model-icon">✦</span>
                  <span className="model-info">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                    <small>Maximum {item.max} seconds</small>
                  </span>
                  <span className="check">{model === key ? "✓" : ""}</span>
                </button>
              ))}
            </div>

            <div className="setting-group">
              <div className="label-row">
                <label>Video Duration</label>
                <span>MAX {activeModel.max} SEC</span>
              </div>

              <div className="choice-grid">
                {activeModel.durations.map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={"choice " + (duration === value ? "selected" : "")}
                    onClick={() => setDuration(value)}
                    aria-pressed={duration === value}
                  >
                    {value} Seconds
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label>Aspect Ratio</label>
              <div className="ratio-grid">
                {["16:9", "9:16", "1:1"].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={"choice " + (ratio === value ? "selected" : "")}
                    onClick={() => setRatio(value)}
                    aria-pressed={ratio === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="summary">
              <h4>✦ GENERATION SUMMARY</h4>
              {summary.map(([label, value]) => (
                <div className="summary-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="generate"
              disabled={!prompt.trim()}
              onClick={handleGenerate}
            >
              ✦ Generate Video <span>➜</span>
            </button>

            {notice && <div className="notice" role="status">{notice}</div>}

            <p className="disclaimer">
              Connect a video provider API to enable actual video generation.
            </p>
          </aside>
        </div>
      </>
    );
  }

  function renderOtherPage() {
    const page = NAVIGATION.find((item) => item.id === activePage);

    const descriptions = {
      projects: "Your saved video projects will appear here.",
      history: "Your recent generation activity will appear here.",
      image: "Image Generator workspace.",
      models: "Available AI video generation models.",
    };

    return (
      <section className="panel empty-page">
        <div className="empty-icon">{page?.icon}</div>
        <h2>{page?.label}</h2>
        <p>{descriptions[activePage]}</p>

        {activePage === "models" && (
          <div className="model-list">
            <div><strong>Seedance 2.0</strong><span>5 / 10 / 15 seconds</span></div>
            <div><strong>Seedance 2.5</strong><span>5 / 10 / 15 / 20 / 25 / 30 seconds</span></div>
          </div>
        )}

        <button
          type="button"
          className="back-btn"
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
        <button className="brand" onClick={() => setActivePage("studio")}>
          <span className="logo">P</span>
          <span>
            <strong>PRIME AI</strong>
            <small>CREATIVE STUDIO</small>
          </span>
        </button>

        {["WORKSPACE", "TOOLS"].map((group) => (
          <div className="nav-group" key={group}>
            <p className="nav-label">{group}</p>
            {NAVIGATION.filter((item) => item.group === group).map((item) => (
              <button
                type="button"
                key={item.id}
                className={"nav-item " + (activePage === item.id ? "active" : "")}
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
            <h3>Your creativity,<br />without limits.</h3>
            <p>Make your next idea happen.</p>
          </div>

          <div className="profile">
            <div className="avatar">P</div>
            <div><strong>Prime User</strong><small>Personal Workspace</small></div>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span>Workspace / </span>
            <strong>{NAVIGATION.find((item) => item.id === activePage)?.label}</strong>
          </div>
          <div className="status"><span /> SYSTEM ONLINE</div>
        </header>

        <div className="content">
          {activePage === "studio" ? renderStudio() : renderOtherPage()}

          <footer>
            <span>PRIME AI © 2026</span>
            <span>CREATIVE VIDEO STUDIO</span>
          </footer>
        </div>
      </section>

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

        .app-shell { min-height: 100vh; display: flex; background: #080910; }
        .sidebar {
          width: 230px; flex: 0 0 230px; min-height: 100vh;
          display: flex; flex-direction: column; padding: 25px 16px;
          background: #0c0d17; border-right: 1px solid #25243a;
        }
        .brand {
          display: flex; align-items: center; gap: 12px; width: 100%;
          padding: 0 4px 42px; border: 0; background: transparent;
          color: white; text-align: left; cursor: pointer;
        }
        .logo {
          width: 43px; height: 43px; display: grid; place-items: center;
          border-radius: 13px; background: linear-gradient(135deg,#a98aff,#6736db);
          font-size: 25px; font-weight: 900;
        }
        .brand strong { display: block; font-size: 17px; letter-spacing: 2px; }
        .brand small { display: block; margin-top: 4px; color: #89859e; font-size: 9px; letter-spacing: 2px; }
        .nav-group { margin-bottom: 22px; }
        .nav-label { margin: 0 10px 12px; color: #68647f; font-size: 10px; letter-spacing: 1.6px; }
        .nav-item {
          width: 100%; display: flex; align-items: center; gap: 12px;
          padding: 12px; margin-bottom: 5px; border: 1px solid transparent;
          border-radius: 9px; color: #aaa7bb; background: transparent;
          text-align: left; font-size: 12px; cursor: pointer; transition: .18s;
        }
        .nav-item span { width: 17px; color: #b7a0f5; text-align: center; }
        .nav-item:hover { background: #171426; color: white; }
        .nav-item.active { color: #d0bdff; background: #25183f; border-color: #54358b; }
        .sidebar-bottom { margin-top: auto; }
        .pro-card {
          padding: 17px; border: 1px solid #443166; border-radius: 12px;
          background: linear-gradient(140deg,#21163b,#11101c);
        }
        .pro-card span { color: #b99bff; font-size: 9px; letter-spacing: 1px; }
        .pro-card h3 { font-size: 16px; line-height: 1.45; }
        .pro-card p { color: #9994aa; font-size: 10px; }
        .profile { display: flex; align-items: center; gap: 10px; padding: 20px 3px 0; font-size: 11px; }
        .avatar {
          width: 34px; height: 34px; display: grid; place-items: center;
          border-radius: 50%; background: #473071;
        }
        .profile small { display: block; margin-top: 4px; color: #89859b; font-size: 9px; }
        .main-area { min-width: 0; flex: 1; }
        .topbar {
          height: 66px; display: flex; align-items: center;
          justify-content: space-between; padding: 0 35px;
          border-bottom: 1px solid #242438; font-size: 11px;
        }
        .topbar div:first-child span { color: #77738e; }
        .status { color: #a6a2b4; font-size: 9px; letter-spacing: 1px; }
        .status span {
          display: inline-block; width: 7px; height: 7px;
          margin-right: 8px; border-radius: 50%; background: #48d59b;
        }
        .content { width: 100%; max-width: 1450px; margin: auto; padding: 30px 35px; }
        .hero {
          min-height: 205px; display: flex; align-items: center;
          justify-content: space-between; overflow: hidden; padding: 28px 40px;
          border: 1px solid #3a2a62; border-radius: 17px;
          background: radial-gradient(ellipse at 83% 45%,#4722a7 0%,#21123f 35%,#11111f 76%);
        }
        .eyebrow { color: #c1a6ff; font-size: 9px; letter-spacing: 2px; }
        .hero h1 { margin: 15px 0 9px; font-size: clamp(29px,3vw,41px); line-height: 1.13; }
        .hero h1 span { color: #b38bff; }
        .hero p { color: #bbb5ce; font-size: 11px; }
        .hero-art { position: relative; width: 250px; height: 150px; display: grid; place-items: center; }
        .orbit {
          position: absolute; width: 230px; height: 70px;
          border: 10px dashed #a48aff44; border-radius: 50%;
        }
        .orbit-one { transform: rotate(-18deg); }
        .orbit-two { transform: rotate(28deg); }
        .hero-logo {
          z-index: 1; width: 100px; height: 100px; display: grid;
          place-items: center; border-radius: 25px;
          background: linear-gradient(145deg,#bd9aff,#5b20dc 65%,#28105f);
          box-shadow: 0 0 45px #a879ff99; font-size: 42px;
        }
        .section-heading {
          display: flex; align-items: center; justify-content: space-between;
          gap: 15px; margin: 30px 0 17px;
        }
        .section-heading h2 { margin: 0; font-size: 20px; }
        .section-heading p { margin: 6px 0 0; color: #89859b; font-size: 11px; }
        .tag {
          padding: 9px 12px; border: 1px solid #53358a; border-radius: 8px;
          color: #d0baff; background: #211735; font-size: 9px;
        }
        .workspace {
          display: grid; grid-template-columns: minmax(0,1.5fr) minmax(330px,1fr);
          align-items: start; gap: 17px;
        }
        .left-column { display: grid; gap: 14px; min-width: 0; }
        .panel {
          min-width: 0; padding: 21px; border: 1px solid #2d2b43;
          border-radius: 14px; background: #10111d;
        }
        .panel-title { display: flex; align-items: center; gap: 10px; margin-bottom: 17px; }
        .panel-title h3 { margin: 0; font-size: 12px; letter-spacing: .5px; }
        .step {
          width: 26px; height: 26px; display: grid; place-items: center;
          border-radius: 50%; color: white; background: linear-gradient(135deg,#8f36ff,#5b13d4);
          font-size: 9px; font-weight: bold;
        }
        .optional { margin-left: auto; color: #77738b; font-size: 8px; }
        .upload {
          min-height: 175px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; overflow: hidden;
          border: 1px dashed #66518d; border-radius: 10px;
          background: #171526; cursor: pointer; transition: .18s;
        }
        .upload:hover,.upload.dragging { border-color: #b18aff; background: #201832; }
        .upload-icon {
          width: 39px; height: 39px; display: grid; place-items: center;
          border-radius: 12px; color: #d4c0ff; background: #352354; font-size: 24px;
        }
        .upload h3 { margin: 11px 0 3px; font-size: 12px; }
        .upload p { margin: 4px 0 9px; color: #aaa4ba; font-size: 10px; }
        .upload small { color: #77738b; font-size: 8px; }
        .preview-wrap { width: 100%; display: flex; flex-direction: column; align-items: center; padding: 10px; }
        .preview-wrap img { max-width: 100%; max-height: 220px; object-fit: contain; border-radius: 7px; }
        .preview-info { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 10px; color: #9ce0bd; font-size: 10px; }
        .preview-info span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .remove-btn {
          padding: 7px 9px; border: 1px solid #65404e; border-radius: 6px;
          color: #ffc2cb; background: #2a1721; font-size: 9px; cursor: pointer;
        }
        textarea {
          width: 100%; min-height: 145px; resize: vertical; padding: 14px;
          border: 1px solid #39364e; border-radius: 9px; outline: none;
          color: white; background: #0b0c15; font-size: 11px; line-height: 1.7;
        }
        textarea:focus { border-color: #9c72ed; box-shadow: 0 0 0 2px #9c72ed22; }
        textarea::placeholder { color: #77738a; }
        .prompt-footer { display: flex; justify-content: space-between; gap: 10px; margin-top: 9px; color: #77738a; font-size: 9px; }
        .sample-btn { padding: 0; border: 0; color: #b795ff; background: transparent; font-size: 10px; cursor: pointer; }
        .sample-btn:hover { color: white; }
        .setting-group { margin-top: 23px; }
        .setting-group label { display: block; margin-bottom: 10px; color: #e0ddeb; font-size: 11px; font-weight: 600; }
        .model-option {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 11px; margin-bottom: 8px; border: 1px solid #37334b;
          border-radius: 9px; color: #eae7f3; background: #171725;
          text-align: left; cursor: pointer; transition: .18s;
        }
        .model-option:hover { border-color: #8560c5; }
        .model-option.selected { border-color: #9566ed; background: #241a3a; }
        .model-icon {
          width: 32px; height: 32px; display: grid; place-items: center;
          border-radius: 8px; color: #d9c8ff; background: #3a2860; font-size: 17px;
        }
        .model-info { flex: 1; }
        .model-info strong { display: block; font-size: 11px; }
        .model-info small { display: block; margin-top: 4px; color: #9690a8; font-size: 9px; }
        .check { width: 19px; height: 19px; display: grid; place-items: center; border: 1px solid #5b526f; border-radius: 50%; font-size: 10px; }
        .selected .check { border-color: #9e72f2; background: #8549e8; }
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .label-row > span { margin-bottom: 10px; color: #b99bff; font-size: 8px; }
        .choice-grid,.ratio-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 7px; }
        .choice {
          min-height: 38px; padding: 8px 5px; border: 1px solid #39364e;
          border-radius: 8px; color: #aaa6b8; background: #171724;
          font-size: 10px; cursor: pointer; transition: .16s;
        }
        .choice:hover { border-color: #9168e5; color: white; }
        .choice.selected {
          border-color: #a16eff; color: white;
          background: linear-gradient(110deg,#5a20cb,#8d43ed);
          box-shadow: 0 4px 15px #7135d544;
        }
        .summary {
          margin-top: 23px; padding: 13px; border: 1px solid #2e2b43;
          border-radius: 9px; background: #0b0c15;
        }
        .summary h4 { margin: 0 0 12px; font-size: 10px; }
        .summary-row { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; font-size: 10px; }
        .summary-row span { color: #89859b; }
        .summary-row strong { color: #f1eef8; font-weight: 500; text-align: right; }
        .generate {
          width: 100%; display: flex; justify-content: center; align-items: center;
          gap: 8px; margin-top: 17px; padding: 14px; border: 0;
          border-radius: 9px; color: white;
          background: linear-gradient(100deg,#6e2be0,#a04ff0);
          box-shadow: 0 5px 20px #7949d544; font-size: 12px;
          font-weight: bold; cursor: pointer; transition: .18s;
        }
        .generate span { margin-left: auto; }
        .generate:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
        .generate:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
        .notice {
          margin-top: 11px; padding: 10px; border: 1px solid #70572f;
          border-radius: 7px; color: #f1d49a; background: #241d12;
          font-size: 10px; line-height: 1.5;
        }
        .disclaimer { margin: 11px 0 0; color: #716d82; font-size: 8px; line-height: 1.5; text-align: center; }
        .empty-page { min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .empty-icon { color: #b18aff; font-size: 38px; }
        .empty-page h2 { margin: 14px 0 5px; }
        .empty-page p { color: #9690a8; font-size: 12px; }
        .model-list { width: min(100%,400px); margin: 15px 0; }
        .model-list div { display: flex; justify-content: space-between; gap: 15px; padding: 12px; border-bottom: 1px solid #343047; font-size: 11px; }
        .model-list span { color: #b99bff; }
        .back-btn { margin-top: 15px; padding: 11px 16px; border: 1px solid #7650b4; border-radius: 8px; color: white; background: #2a1b45; cursor: pointer; }
        footer {
          display: flex; justify-content: space-between; gap: 12px;
          margin-top: 30px; padding-top: 17px; border-top: 1px solid #29283b;
          color: #77738a; font-size: 8px; letter-spacing: 1px;
        }

        @media(max-width:1050px) {
          .sidebar { width: 205px; flex-basis: 205px; }
          .content { padding: 25px 22px; }
          .workspace { grid-template-columns: minmax(0,1.2fr) minmax(300px,1fr); }
          .hero-art { width: 190px; }
        }
        @media(max-width:800px) {
          .sidebar { width: 72px; flex-basis: 72px; padding: 20px 9px; }
          .brand { justify-content: center; padding: 0 0 35px; }
          .brand > span:last-child,.nav-label,.pro-card,.profile { display: none; }
          .nav-item { justify-content: center; padding: 13px 5px; font-size: 0; }
          .nav-item span { font-size: 17px; }
          .workspace { grid-template-columns: 1fr; }
          .hero-art { display: none; }
        }
        @media(max-width:560px) {
          .sidebar { display: none; }
          .topbar { height: 58px; padding: 0 15px; }
          .content { padding: 18px 13px; }
          .hero { min-height: 180px; padding: 22px; }
          .hero h1 { font-size: 29px; }
          .section-heading { align-items: flex-start; }
          .section-heading h2 { font-size: 17px; }
          .panel { padding: 16px; }
          footer { font-size: 7px; }
        }
      `}</style>
    </main>
  );
}
