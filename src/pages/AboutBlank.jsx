import { useState } from "react";
import { ExternalLink, Maximize2, RotateCw } from "lucide-react";

function normalizeUrl(value) {
  const input = value.trim();
  if (!input) return "about:blank";
  try {
    return new URL(input).toString();
  } catch {
    return new URL(`https://${input}`).toString();
  }
}

export default function AboutBlank() {
  const [address, setAddress] = useState("");
  const [src, setSrc] = useState("about:blank");

  function openSite(event) {
    event.preventDefault();
    setSrc(normalizeUrl(address));
  }

  function reloadFrame() {
    setSrc((current) => `${current}${current.includes("?") ? "&" : "?"}_reload=${Date.now()}`);
  }

  return (
    <section className="about-blank-page">
      <div className="about-blank-header">
        <div>
          <p className="eyebrow">Private workspace / blank canvas</p>
          <h1>about:blank</h1>
          <p className="about-blank-copy">Open a site in a clean, distraction-free frame.</p>
        </div>
        <div className="about-blank-actions">
          <button type="button" onClick={reloadFrame} title="Reload frame" aria-label="Reload frame"><RotateCw size={16} /></button>
          <button type="button" onClick={() => document.querySelector(".about-blank-frame")?.requestFullscreen()} title="Fullscreen frame" aria-label="Fullscreen frame"><Maximize2 size={16} /></button>
        </div>
      </div>
      <form className="about-blank-form" onSubmit={openSite}>
        <span className="about-blank-prefix">https://</span>
        <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter a website address" aria-label="Website address" />
        <button type="submit"><ExternalLink size={16} /> Open</button>
      </form>
      <div className="about-blank-frame-wrap">
        <iframe className="about-blank-frame" title="Blank website frame" src={src} allow="fullscreen; autoplay; clipboard-read; clipboard-write" />
        {src === "about:blank" && <div className="about-blank-empty"><span>⌁</span><strong>Your blank space is ready.</strong><small>Enter a URL above to load a site in the frame.</small></div>}
      </div>
    </section>
  );
}
