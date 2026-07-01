// app/page.js
// Placeholder home page — this is a BACKEND-ONLY package.
// The Frontend Developer will replace this with the real landing page.

export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>AI Travel Receptionist — Backend Ready</h1>
      <p>This is a backend-only build. Available API endpoints:</p>
      <ul>
        <li>GET /api/health</li>
        <li>POST /api/ai/chat</li>
        <li>POST /api/leads</li>
        <li>GET /api/leads/list?key=YOUR_KEY</li>
      </ul>
      <p>See README.md for setup and testing instructions.</p>
    </main>
  );
}
