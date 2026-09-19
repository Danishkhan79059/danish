import JsonFormatterTool from "@/components/tools/json-formatter/JsonFormatterTool";

export const metadata = {
  title: "Free JSON Formatter & Validator Online",
  description:
    "Format, beautify, validate and minify JSON online for free. Fast, private and easy to use.",
  keywords: [
    "JSON Formatter",
    "JSON Validator",
    "JSON Beautifier",
    "JSON Minifier",
    "Online JSON Formatter",
    "Format JSON",
    "Validate JSON",
    "Prettify JSON",
    "Free JSON Parser",
    "Developer Tools",
  ],
  alternates: {
    canonical: "/tools/json-formatter",
  },
  openGraph: {
    title: "Free JSON Formatter & Validator Online",
    description:
      "Format, beautify, validate and minify JSON online for free. Fast, private and easy to use.",
    url: "/tools/json-formatter",
    siteName: "Danish Khan Portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter & Validator Online",
    description:
      "Format, beautify, validate and minify JSON online for free. Fast, private and easy to use.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function JsonFormatterPage() {
  const jsonLdWebapp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free JSON Formatter & Validator Online",
    url: "https://yourportfolio.com/tools/json-formatter",
    description:
      "Format, beautify, validate and minify JSON online for free. Fast, private and easy to use directly in the browser.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    creator: {
      "@type": "Person",
      name: "Danish Khan",
    },
  };

  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://yourportfolio.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Developer Tools",
        item: "https://yourportfolio.com/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "JSON Formatter",
        item: "https://yourportfolio.com/tools/json-formatter",
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is JSON?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JSON (JavaScript Object Notation) is a lightweight, human-readable data interchange format widely used in web development, REST APIs, and configuration files.",
        },
      },
      {
        "@type": "Question",
        name: "What does a JSON formatter do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A JSON formatter takes raw, unformatted, or minified JSON text and reorganizes it with proper line breaks and indentation (usually 2 spaces, 4 spaces, or tabs).",
        },
      },
      {
        "@type": "Question",
        name: "How do I validate JSON?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Paste your JSON string into the editor and click Validate. The tool checks RFC 8259 conformity and pinpoints any exact syntax error with line and column numbers.",
        },
      },
      {
        "@type": "Question",
        name: "Can I minify JSON?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, click Minify to strip out all unnecessary whitespace and newlines for compact payloads.",
        },
      },
      {
        "@type": "Question",
        name: "Is my JSON uploaded to any server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. All parsing, validation, formatting, and file exports are executed locally inside your web browser using client-side JavaScript. Your data never leaves your device.",
        },
      },
      {
        "@type": "Question",
        name: "Can I download formatted JSON?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, click Download in the output panel to save your formatted JSON file locally via browser Blob APIs.",
        },
      },
      {
        "@type": "Question",
        name: "Can I format large JSON files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, our client-side engine efficiently processes multi-megabyte JSON payloads directly in browser memory without server timeouts or payload limits.",
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebapp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      <JsonFormatterTool />
    </>
  );
}
