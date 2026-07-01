// app/layout.js
// Minimal root layout — required by Next.js App Router for the app to build.
// The Frontend Developer will replace this with the real landing page layout
// (Navbar, fonts, metadata, etc.) as part of their Day 1 / Day 7 tasks.

export const metadata = {
  title: "ABC Travels — AI Receptionist",
  description: "Talk to our AI travel assistant and get the perfect package",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
