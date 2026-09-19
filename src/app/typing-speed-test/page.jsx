import TypingSpeedTestClient from "@/components/typing-speed-test/TypingSpeedTestClient";

export const metadata = {
  title: "Typing Speed Test – Free Online WPM Test",
  description:
    "Test your typing speed and accuracy with a free online typing test. Measure WPM, accuracy, mistakes, characters, and typing performance instantly.",
  keywords: [
    "Typing Speed Test",
    "WPM Test",
    "Words Per Minute",
    "Typing Test Online",
    "Free Typing Speed Test",
    "Keyboard Speed Test",
    "Typing Accuracy",
    "Touch Typing Practice",
    "Developer Tools",
    "Programming Typing Test",
  ],
  alternates: {
    canonical: "/typing-speed-test",
  },
  openGraph: {
    title: "Typing Speed Test – Free Online WPM Test",
    description:
      "Test your typing speed and accuracy with a free online typing test. Measure WPM, accuracy, mistakes, characters, and typing performance instantly.",
    url: "/typing-speed-test",
    siteName: "Danish Khan Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Typing Speed Test – Free Online WPM Test",
    description:
      "Test your typing speed and accuracy with a free online typing test. Measure WPM, accuracy, mistakes, characters, and typing performance instantly.",
  },
};

export default function TypingSpeedTestPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Typing Speed Test Online",
    url: "https://yourportfolio.com/typing-speed-test",
    description:
      "Test your typing speed and accuracy with a free online typing test. Measure WPM, accuracy, mistakes, characters, and typing performance instantly.",
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
      <TypingSpeedTestClient />
    </>
  );
}
