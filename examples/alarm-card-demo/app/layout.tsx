import './globals.css';

export const metadata = {
  title: 'Alarm Card Demo',
  description: 'Generative alert card demo powered by the Vercel AI SDK.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
