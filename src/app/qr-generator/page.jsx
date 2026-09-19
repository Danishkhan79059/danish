import QrGeneratorClient from "@/components/qr-generator/QrGeneratorClient";

export const metadata = {
  title: "Free QR Code Generator Online",
  description:
    "Create free QR codes for websites, text, contacts, Wi-Fi, email, phone numbers and more. Generate and download QR codes instantly.",
  keywords: [
    "QR Code Generator",
    "Free QR Code Generator",
    "WiFi QR Code",
    "vCard QR Code",
    "URL to QR Code",
    "Text to QR Code",
    "Email QR Code",
    "Contact QR Code",
    "Local QR Code Generator",
    "High Resolution QR Code",
    "SVG QR Code",
    "PNG QR Code",
    "Developer Tools",
  ],
  alternates: {
    canonical: "/qr-generator",
  },
  openGraph: {
    title: "Free QR Code Generator Online",
    description:
      "Create free QR codes for websites, text, contacts, Wi-Fi, email, phone numbers and more. Generate and download QR codes instantly.",
    url: "/qr-generator",
    siteName: "Danish Khan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator Online",
    description:
      "Create free QR codes for websites, text, contacts, Wi-Fi, email, phone numbers and more. Generate and download QR codes instantly.",
  },
};

export default function QrGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free QR Code Generator Online",
    url: "https://yourportfolio.com/qr-generator",
    description:
      "Create free QR codes for websites, text, contacts, Wi-Fi, email, phone numbers and more. Generate and download QR codes instantly.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QrGeneratorClient />
    </>
  );
}
