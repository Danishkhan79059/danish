import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://yourportfolio.com"),

  title: {
    default:
      "Danish Khan | Full-Stack MERN Developer & SaaS Product Engineer",
    template: "%s | Danish Khan",
  },

  description:
    "Danish Khan is a Full-Stack MERN Developer with 3+ years of experience building SaaS products, data visualization platforms, multi-tenant applications, logistics platforms, dashboards, APIs, and scalable web applications.",

  keywords: [
    "Danish Khan",
    "Full Stack Developer",
    "MERN Stack Developer",
    "MERN Developer",
    "React Developer",
    "Node.js Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "SaaS Developer",
    "SaaS Product Engineer",
    "Full Stack JavaScript Developer",
    "Multi Tenant SaaS",
    "Multi Tenant Architecture",
    "Data Visualization",
    "Analytics Dashboard",
    "Business Intelligence Dashboard",
    "Logistics SaaS",
    "Courier Aggregator Platform",
    "REST API Development",
    "Web Application Development",
    "Technical SEO",
    "Google Ads",
  ],

  authors: [
    {
      name: "Danish Khan",
    },
  ],

  creator: "Danish Khan",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title:
      "Danish Khan | Full-Stack MERN Developer & SaaS Product Engineer",

    description:
      "Full-Stack MERN Developer with 3+ years of experience building SaaS products, data visualization platforms, multi-tenant systems, logistics applications, and scalable web solutions.",

    url: "https://yourportfolio.com",

    siteName: "Danish Khan Portfolio",

    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Danish Khan | Full-Stack MERN Developer & SaaS Product Engineer",

    description:
      "Building SaaS products, data visualization platforms, multi-tenant applications and scalable web solutions with the MERN stack.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${poppins.className} font-medium antialiased min-h-screen flex flex-col bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900`}
      >
        <Header />

        <main className="flex-1 bg-white">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}