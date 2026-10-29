import type { Metadata } from 'next';
import { GoogleTagManager } from '@next/third-parties/google';
import { Cormorant_Garamond, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ subsets: ['latin'], variable:'--font-cormorant', display:'swap', weight:['400','500','600'], style:['normal','italic'] });
const body = DM_Sans({ subsets:['latin'], variable:'--font-dm-sans', display:'swap' });
const mono = IBM_Plex_Mono({ subsets:['latin'], variable:'--font-plex-mono', display:'swap', weight:['400','500'] });
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

export const metadata: Metadata = {
  title: 'Aleksandra Sobańska — Fullstack Developer',
  description: 'Design-minded, logic-driven fullstack developer crafting thoughtful digital experiences.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {title:'Aleksandra Sobańska — Fullstack Developer', description:'Thoughtfully designed. Carefully engineered.', type:'website'},
  icons: {
    icon: [{url:'/favicon.ico', sizes:'48x48'}, {url:'/icon.svg', type:'image/svg+xml'}],
    apple: '/apple-icon.png',
  },
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} scroll-smooth leading-[normal] motion-reduce:scroll-auto`}>{gtmId && <GoogleTagManager gtmId={gtmId} />}<body className="bg-ivory text-ink antialiased selection:bg-rose-pale selection:text-wine">{children}</body></html>;
}
