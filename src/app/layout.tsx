import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { SearchModal } from '@/components/SearchModal';
import { FreebiesModal } from '@/components/FreebiesModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { QuickViewModal } from '@/components/QuickViewModal';
import { SharePreviewModal } from '@/components/SharePreviewModal';
import { GlobalIntro } from '@/components/GlobalIntro';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://virtualvisionmedia.com';

export const viewport: Viewport = {
  themeColor: '#07070A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Virtual Vision Media (VVM) — 150+ Folders | 100GB+ Master Video Editor Assets Vault',
    template: '%s | Virtual Vision Media',
  },
  description: 'The definitive creative archive for video editors and filmmakers. 102.4 GB verified collection of universal .CUBE LUTs, ProRes 422 transitions, 96kHz broadcast sound effects, and 35mm optical grain overlays. Lifetime commercial license for ₹49.',
  keywords: [
    'video editing assets',
    '100gb bundle',
    '150 folders',
    'cinematic luts',
    'prores transitions',
    '96khz sfx',
    'davinci resolve luts',
    'premiere pro templates',
    'capcut video assets',
    'virtual vision media',
    'film grain overlays',
    'sound effects pack'
  ],
  authors: [{ name: 'Virtual Vision Media' }],
  creator: 'Virtual Vision Media',
  publisher: 'Virtual Vision Media',
  icons: {
    icon: '/vvm-logo.png',
    apple: '/vvm-logo.png',
  },
  // Open Graph for WhatsApp, Instagram, Facebook, LinkedIn, Discord
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Virtual Vision Media (VVM)',
    title: '150+ Folders | 100GB+ Master Video Editor Assets Vault (₹49 Only)',
    description: 'The ultimate creator library: 102.4 GB verified .CUBE LUTs, ProRes 422 transitions, 96kHz sound effects, and 4K optical overlays. Lifetime commercial license.',
    images: [
      {
        url: '/og-image.jpg',
        width: 764,
        height: 1024,
        alt: 'Virtual Vision Media 150+ Folders 100GB+ Master Video Editor Assets Vault Poster',
        type: 'image/jpeg',
      },
    ],
  },
  // Twitter / X Card Preview (Large Summary Card)
  twitter: {
    card: 'summary_large_image',
    site: '@virtualvisionmedia',
    creator: '@virtualvisionmedia',
    title: '150+ Folders | 100GB+ Master Video Editor Assets Vault (₹49 Only)',
    description: '102.4 GB verified creative archive: Universal .CUBE LUTs, ProRes 422 transitions, 96kHz sound effects & 4K overlays for ₹49.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#F7F7F5]">
      <body className="bg-[#F7F7F5] min-h-screen text-[#151515] flex flex-col antialiased">
        <CartProvider>
          <GlobalIntro />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />

          {/* Interactive Global Overlays & Modals */}
          <CartDrawer />
          <SearchModal />
          <FreebiesModal />
          <CheckoutModal />
          <QuickViewModal />
          <SharePreviewModal />
        </CartProvider>
      </body>
    </html>
  );
}
