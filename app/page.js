"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("10");
  const [ratio, setRatio] = useState("16:9");
  const [message, setMessage] = useState("");

  function uploadImage(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">P</div>
          <div>
            <h2>PRIME AI</h2>
            <span>CREATIVE STUDIO</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav active">✦ &nbsp; AI Video Studio</div>
        <div className="nav">▧ &nbsp; My Projects</div>
        <div className="nav">◷ &nbsp; History</div>

        <p className="nav-label">TOOLS</p>
        <div className="nav">✧ &nbsp; Image Generator</div>
        <div className="nav">◈ &nbsp; AI Models</div>

        <div className="sidebar-bottom">
          <div className="pro-card">
            <span>✦ PRIME STUDIO</span>
            <h3>Your creativity,<br/>without limits.</h3>
            <p>Create something extraordinary.</p>
          </div>
          <div className="profile">
            <div className="avatar">R</div>
            <div>
              <b>Prime User</b>
              <small>Personal Workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <section className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <b>AI Video Studio</b>
          </div>
          <div className="status">
            <span className="dot"/> SYSTEM ONLINE
          </div>
        </header>

        <div className="content">
          <div className="hero">
            <div>
              <span className="eyebrow">✦ NEXT GENERATION AI CREATION</span>
              <h1>Bring your imagination<br/>
                <span>to life.</span>
              </h1>
              <p>Transform your ideas and images into cinematic AI videos.</p>
            </div>
            <div className="hero-art">
              <div className="orb">✦</div>
              <div className="orb-text">PRIME<br/>INTELLIGENCE</div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <h2>Create New Video</h2>
              <p>Configure your generation settings below.</p>
            </div>
            <span className="model-tag">✦ RUNWAY AI</span>
          </div>

          <div className="workspace">
            <div className="panel">
              <label className="field-title">01 — REFERENCE IMAGE</label>

              <label className="upload">
                {preview ? (
                  <img src={preview} className="preview"/>
                ) : (
                  <>
                    <div className="upload-icon">↑</div>
                    <h3>Upload your image</h3>
                    <p>Drag and drop or browse your files</p>
                    <span>PNG, JPG, WEBP</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={uploadImage}
                  hidden
                />
              </label>

              {file && <p className="filename">✓ {file.name}</p>}

              <label className="field-title prompt-title">
                02 — VIDEO PROMPT
              </label>

              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your vision... Tell PRIME AI what should happen in your video."
              />

              <div className="prompt-hint">
                Be descriptive for better results.
                <span>{prompt.length} characters</span>
              </div>
            </div>

            <div className="panel settings">
              <label className="field-title">03 — GENERATION SETTINGS</label>

              <div className="setting-group">
                <label>Video Duration</label>
                <div className="choices">
                  {["5","10"].map(v => (
                    <button
                      key={v}
                      className={duration === v ? "choice selected" : "choice"}
                      onClick={() => setDuration(v)}
                    >
                      {v} Seconds
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>Aspect Ratio</label>
                <div className="choices">
                  {["16:9","9:16","1:1"].map(v => (
                    <button
                      key={v}
                      className={ratio === v ? "choice selected" : "choice"}
                      onClick={() => setRatio(v)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>AI Model</label>
                <div className="model-box">
                  <div className="model-icon">✦</div>
                  <div>
                    <b>Runway</b>
                    <small>AI Video Generation</small>
                  </div>
                  <span className="model-active">ACTIVE</span>
                </div>
              </div>

              <div className="summary">
                <span>Duration</span><b>{duration} seconds</b>
                <span>Aspect Ratio</span><b>{ratio}</b>
                <span>Reference</span><b>{file ? "Uploaded" : "None"}</b>
              </div>

              <button
                className="generate"
                onClick={() => setMessage(
                  "Tampilan sudah siap. Integrasi Runway API akan diaktifkan pada tahap berikutnya."
                )}
              >
                ✦ &nbsp; Generate Video
              </button>

              {message && <p className="notice">{message}</p>}
              <p className="disclaimer">
                AI generation requires an active API connection.
              </p>
            </div>
          </div>

          <footer>
            <span>PRIME AI © 2026</span>
            <span>POWERED BY ARTIFICIAL INTELLIGENCE</span>
          </footer>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #080910; color: #f5f4fa;
          font-family: Arial, sans-serif; }
        button { font-family: inherit; }
        .app { min-height: 100vh; display: flex; }
        .sidebar { width: 245px; background: #0c0d17;
          border-right: 1px solid #242438; padding: 27px 18px;
          display: flex; flex-direction: column; flex-shrink: 0; }
        .brand { display:flex; align-items:center; gap:12px;
          padding: 0 5px 42px; }
        .logo { width:42px; height:42px; display:grid; place-items:center;
          background:linear-gradient(135deg,#a78bfa,#6635db);
          border-radius:13px; font-size:25px; font-weight:900; }
        .brand h2 { font-size:17px; margin:0; letter-spacing:2px; }
        .brand span { font-size:9px; color:#8f8ba6; letter-spacing:2px; }
        .nav-label { color:#65627c; font-size:10px; letter-spacing:1.5px;
          margin:16px 10px; }
        .nav { padding:13px 12px; border-radius:9px; color:#aaa8bb;
          font-size:13px; margin-bottom:5px; cursor:pointer; }
        .nav.active { background:#21183b; color:#b99bff;
          border:1px solid #403064; }
        .sidebar-bottom { margin-top:auto; }
        .pro-card { padding:18px; border:1px solid #443166;
          border-radius:12px; background:linear-gradient(140deg,#21163b,#11101c); }
        .pro-card span { font-size:9px; color:#b99bff; letter-spacing:1px; }
        .pro-card h3 { font-size:17px; line-height:1.5; }
        .pro-card p { font-size:11px; color:#9994aa; }
        .profile { display:flex; gap:11px; align-items:center;
          padding:23px 3px 0; font-size:12px; }
        .avatar { width:34px; height:34px; border-radius:50%;
          display:grid; place-items:center; background:#473071; }
        .profile small,.model-box small { display:block; color:#89859b;
          margin-top:4px; font-size:10px; }
        .main { flex:1; min-width:0; }
        .topbar { height:72px; border-bottom:1px solid #242438;
          display:flex; justify-content:space-between; align-items:center;
          padding:0 38px; font-size:12px; }
        .breadcrumb { color:#77738e; }
        .status { color:#9b98ab; font-size:10px; letter-spacing:1px; }
        .dot { display:inline-block; width:7px; height:7px;
          background:#48d59b; border-radius:50%; margin-right:7px; }
        .content { max-width:1200px; margin:auto; padding:38px 42px; }
        .hero { min-height:220px; display:flex; align-items:center;
          justify-content:space-between; padding:30px 42px;
          border:1px solid #34294d; border-radius:17px;
          background:radial-gradient(ellipse at 85% 40%,#35215b 0%,#191326 35%,#11111d 75%); }
        .eyebrow { color:#b99bff; font-size:10px; letter-spacing:2px; }
        .hero h1 { font-size:38px; line-height:1.2; margin:17px 0 10px; }
        .hero h1 span { color:#a98aff; }
        .hero p { color:#aaa6ba; font-size:12px; }
        .hero-art { width:150px; height:150px; position:relative;
          display:grid; place-items:center; }
        .orb { position:absolute; width:115px; height:115px;
          border-radius:50%; display:grid; place-items:center; font-size:42px;
          color:#d7c8ff; background:radial-gradient(circle at 30% 25%,#bca2ff,#5934a5 45%,#181020 75%);
          box-shadow:0 0 55px #8053cf77; }
        .orb-text { position:absolute; font-size:8px; text-align:center;
          letter-spacing:2px; color:white; font-weight:bold; }
        .section-heading { display:flex; justify-content:space-between;
          align-items:center; margin:35px 0 18px; }
        .section-heading h2 { font-size:20px; margin:0 0 7px; }
        .section-heading p { color:#858197; font-size:12px; margin:0; }
        .model-tag { color:#c1a9ff; background:#211a35; border:1px solid #443262;
          padding:9px 13px; border-radius:8px; font-size:10px; }
        .workspace { display:grid; grid-template-columns:1.5fr 1fr;
          gap:18px; align-items:start; }
        .panel { background:#10111d; border:1px solid #29283b;
          border-radius:13px; padding:23px; min-width:0; }
        .field-title { display:block; font-size:10px; color:#b49aff;
          letter-spacing:1.4px; font-weight:bold; margin-bottom:16px; }
        .upload { min-height:195px; border:1px dashed #554477;
          background:#171526; border-radius:10px; display:flex;
          flex-direction:column; align-items:center; justify-content:center;
          cursor:pointer; overflow:hidden; }
        .upload-icon { width:40px; height:40px; display:grid;
          place-items:center; border-radius:12px; background:#30244a;
          color:#c6adff; font-size:23px; }
        .upload h3 { font-size:13px; margin:12px 0 5px; }
        .upload p { color:#a09bb0; font-size:11px; }
        .upload span { color:#77738a; font-size:9px; }
        .preview { width:100%; max-height:260px; object-fit:contain; }
        .filename { font-size:11px; color:#8de1b7; }
        .prompt-title { margin-top:27px; }
        textarea { width:100%; height:145px; resize:vertical;
          padding:15px; border:1px solid #37344b; border-radius:9px;
          background:#0b0c15; color:white; outline:none;
          font-size:12px; line-height:1.7; }
        textarea:focus { border-color:#9771e8; }
        .prompt-hint { display:flex; justify-content:space-between;
          color:#77738a; font-size:10px; margin-top:9px; }
        .setting-group { margin-top:26px; }
        .setting-group > label { display:block; font-size:12px;
          margin-bottom:12px; color:#ddd9e9; }
        .choices { display:flex; gap:8px; }
        .choice { flex:1; padding:12px 5px; border-radius:8px;
          border:1px solid #353347; background:#171724; color:#aaa6b8;
          cursor:pointer; font-size:11px; }
        .choice.selected { background:#30204e; border-color:#9168e5;
          color:#d4c3ff; }
        .model-box { display:flex; align-items:center; gap:11px;
          padding:13px; border-radius:9px; background:#181725;
          border:1px solid #39334d; }
        .model-icon { width:34px; height:34px; display:grid;
          place-items:center; border-radius:9px; background:#38275b;
          color:#c7adff; }
        .model-box b { font-size:12px; }
        .model-active { margin-left:auto; font-size:9px; color:#73d8a6; }
        .summary { margin-top:25px; padding:15px;
          border-radius:9px; background:#0b0c15; display:grid;
          grid-template-columns:1fr 1fr; gap:14px; font-size:11px; }
        .summary span { color:#858197; }
        .summary b { text-align:right; font-weight:500; }
        .generate { width:100%; margin-top:22px; padding:16px;
          border:0; border-radius:9px; cursor:pointer;
          color:white; font-size:13px; font-weight:bold;
          background:linear-gradient(100deg,#7746d5,#a16ae8);
          box-shadow:0 5px 24px #7949d544; }
        .generate:hover { filter:brightness(1.15); }
        .notice { font-size:11px; color:#e8c98d; line-height:1.5; }
        .disclaimer { text-align:center; color:#716d82; font-size:9px;
          margin-top:13px; }
        footer { border-top:1px solid #29283b; margin-top:35px;
          padding-top:20px; display:flex; justify-content:space-between;
          color:#77738a; font-size:9px; letter-spacing:1px; }
        @media(max-width:850px) {
          .sidebar { width:190px; }
          .content { padding:25px 20px; }
          .workspace { grid-template-columns:1fr; }
          .hero h1 { font-size:30px; }
        }
        @media(max-width:600px) {
          .sidebar { display:none; }
          .topbar { padding:0 17px; }
          .content { padding:20px 13px; }
          .hero { padding:25px 20px; }
          .hero-art { display:none; }
          .hero h1 { font-size:29px; }
          .section-heading h2 { font-size:17px; }
          .panel { padding:17px; }
        }
      `}</style>
    </main>
  );
}
