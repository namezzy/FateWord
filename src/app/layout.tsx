import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '天机测字 — 梅花易数测字问运',
  description: '输入汉字，以梅花易数起卦，解读事业、财运、感情、健康运势。',
  keywords: ['测字', '梅花易数', '运势', '八卦', '五行', '天机'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="ink-bg min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
