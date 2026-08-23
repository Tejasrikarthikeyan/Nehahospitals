import type { Metadata, Viewport } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Neha Hospitals | Compassionate Care. Advanced Medicine.",
    template: "%s | Neha Hospitals",
  },
  description:
    "Neha Hospitals is a multi-specialty healthcare institution in Chennai offering advanced medical care, 24/7 emergency services, expert specialists and patient-centred treatment.",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a3558",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
