import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ContactDock } from "@/components/layout/ContactDock";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/layout/Loader";
import { Navigation } from "@/components/layout/Navigation";
import { ExperienceProvider } from "@/components/providers/ExperienceProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { DynamicLighting } from "@/components/ui/DynamicLighting";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { ogImage, SITE_URL } from "@/lib/seo";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — The Art of Finding Your Place`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  category: "real estate",
  keywords: [
    "luxury real estate India",
    "luxury villas Mumbai",
    "sea-facing apartments Juhu",
    "villas in Goa",
    "penthouses Bengaluru",
    "new residential developments",
    "real estate advisory",
  ],
  creator: site.name,
  publisher: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Fallback for routes without their own Open Graph (e.g. 404).
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [ogImage({ src: media.villaPool, alt: site.name })],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ExperienceProvider>
          <SmoothScroll>
            <Loader />
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
            <ContactDock />
            <DynamicLighting />
            <Cursor />
          </SmoothScroll>
        </ExperienceProvider>
      </body>
    </html>
  );
}
