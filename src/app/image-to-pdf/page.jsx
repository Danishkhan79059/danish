import ImageToPdfClient from "@/components/image-to-pdf/ImageToPdfClient";

export const metadata = {
  title: "JPG PNG SVG to PDF Converter – Free Online Image to PDF",
  description:
    "Convert JPG, JPEG, PNG and SVG images to PDF online for free. Combine multiple images into one PDF, reorder pages, choose page size and download instantly.",
  keywords: [
    "Image to PDF",
    "JPG to PDF",
    "JPEG to PDF",
    "PNG to PDF",
    "SVG to PDF",
    "Convert Images to PDF",
    "Combine Images to PDF",
    "Free Image to PDF Converter",
    "Client-Side Image to PDF",
    "Private PDF Converter",
    "Online PDF Tools",
    "Developer Tools",
  ],
  alternates: {
    canonical: "/image-to-pdf",
  },
  openGraph: {
    title: "JPG PNG SVG to PDF Converter – Free Online Image to PDF",
    description:
      "Convert JPG, JPEG, PNG and SVG images to PDF online for free. Combine multiple images into one PDF, reorder pages, choose page size and download instantly.",
    url: "/image-to-pdf",
    siteName: "Danish Khan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JPG PNG SVG to PDF Converter – Free Online Image to PDF",
    description:
      "Convert JPG, JPEG, PNG and SVG images to PDF online for free. Combine multiple images into one PDF, reorder pages, choose page size and download instantly.",
  },
};

export default function ImageToPdfPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "JPG PNG SVG to PDF Converter",
    url: "https://yourportfolio.com/image-to-pdf",
    description:
      "Convert JPG, JPEG, PNG and SVG images to PDF online for free. Combine multiple images into one PDF, reorder pages, choose page size and download instantly.",
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
      <ImageToPdfClient />
    </>
  );
}
