// Large, soft, blurred color blobs fixed behind all content so every glass
// panel on every page has color underneath it to refract, per the approved
// "liquid glass" design system. Each one drifts slowly and independently
// (via .ambient-blob-a/b/c in globals.css) so the backdrop feels alive
// rather than a static wallpaper.
const BLOBS: Array<{
  drift: "a" | "b" | "c";
  style: React.CSSProperties;
}> = [
  {
    drift: "a",
    style: {
      top: "-180px",
      left: "-160px",
      width: 620,
      height: 620,
      background: "radial-gradient(circle, rgba(0,113,227,0.34), transparent 70%)",
      filter: "blur(50px)",
    },
  },
  {
    drift: "b",
    style: {
      top: "-60px",
      right: "-200px",
      width: 560,
      height: 560,
      background: "radial-gradient(circle, rgba(255,138,92,0.3), transparent 70%)",
      filter: "blur(50px)",
    },
  },
  {
    drift: "c",
    style: {
      top: "28%",
      left: "38%",
      width: 540,
      height: 540,
      background: "radial-gradient(circle, rgba(255,90,160,0.22), transparent 70%)",
      filter: "blur(60px)",
    },
  },
  {
    drift: "b",
    style: {
      top: "38%",
      left: "-180px",
      width: 520,
      height: 520,
      background: "radial-gradient(circle, rgba(45,212,191,0.24), transparent 70%)",
      filter: "blur(55px)",
    },
  },
  {
    drift: "a",
    style: {
      bottom: "-220px",
      left: "10%",
      width: 600,
      height: 600,
      background: "radial-gradient(circle, rgba(160,130,255,0.26), transparent 70%)",
      filter: "blur(55px)",
    },
  },
  {
    drift: "c",
    style: {
      bottom: "-140px",
      right: "-160px",
      width: 560,
      height: 560,
      background: "radial-gradient(circle, rgba(0,113,227,0.24), transparent 70%)",
      filter: "blur(55px)",
    },
  },
];

export default function AmbientBlobs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className={`ambient-blob ambient-blob-${blob.drift}`}
          style={blob.style}
        />
      ))}
      <div className="grain-overlay" />
    </div>
  );
}
