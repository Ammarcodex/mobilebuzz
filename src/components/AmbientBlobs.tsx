// Large, soft, blurred color blobs fixed behind all content so every glass
// panel on every page has color underneath it to refract, per the approved
// "liquid glass" design system.
export default function AmbientBlobs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="ambient-blob"
        style={{
          top: "-180px",
          left: "-160px",
          width: 620,
          height: 620,
          background:
            "radial-gradient(circle, rgba(0,113,227,0.30), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          top: "-60px",
          right: "-200px",
          width: 560,
          height: 560,
          background:
            "radial-gradient(circle, rgba(255,138,92,0.26), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          bottom: "-220px",
          left: "10%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(160,130,255,0.22), transparent 70%)",
          filter: "blur(55px)",
        }}
      />
      <div
        className="ambient-blob"
        style={{
          bottom: "-140px",
          right: "-160px",
          width: 560,
          height: 560,
          background:
            "radial-gradient(circle, rgba(0,113,227,0.2), transparent 70%)",
          filter: "blur(55px)",
        }}
      />
    </div>
  );
}
