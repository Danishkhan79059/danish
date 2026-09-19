import JwtDecoderClient from "@/components/jwt-decoder/JwtDecoderClient";

export const metadata = {
  title: "Free JWT Decoder Online",
  description:
    "Decode and inspect JWT tokens online for free. View JWT header, payload and claims directly in your browser.",
  keywords: [
    "JWT Decoder",
    "Decode JWT",
    "JSON Web Token",
    "JWT Inspector",
    "JWT Parser",
    "Online JWT Decoder",
    "JWT Claims",
    "JWT Header",
    "JWT Payload",
    "Developer Tools",
  ],
  alternates: {
    canonical: "/jwt-decoder",
  },
  openGraph: {
    title: "Free JWT Decoder Online",
    description:
      "Decode and inspect JWT tokens online for free. View JWT header, payload and claims directly in your browser.",
    url: "/jwt-decoder",
    siteName: "Danish Khan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JWT Decoder Online",
    description:
      "Decode and inspect JWT tokens online for free. View JWT header, payload and claims directly in your browser.",
  },
};

export default function JwtDecoderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free JWT Decoder Online",
    url: "https://yourportfolio.com/jwt-decoder",
    description:
      "Decode and inspect JWT tokens online for free. View JWT header, payload and claims directly in your browser.",
    applicationCategory: "DeveloperApplication",
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
      <JwtDecoderClient />
    </>
  );
}
