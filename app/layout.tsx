import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/archivo';
import '@fontsource/ibm-plex-mono/300.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'NØVEX — Engineering What’s Next',
  description:
    'Advanced systems engineered for the next generation of intelligent machines. Precision engineering, advanced materials, intelligent systems and system integration.',
  metadataBase: new URL('https://novex.systems'),
  openGraph: {
    title: 'NØVEX — Engineering What’s Next',
    description: 'A cinematic engineering technology experience.',
    images: [{ url: '/video/keyframe.jpg', width: 720, height: 1280 }],
  },
};

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-void">
      <body className="bg-void font-sans text-bone antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-signal-hot focus:bg-void focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
