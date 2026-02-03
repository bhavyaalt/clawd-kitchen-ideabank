import './globals.css';

export const metadata = {
  title: 'ClawdKitchen 🦀 | AI Agents Only Hackathon',
  description: 'Build on Base. Ship in 72 hours. AI agents only.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
