import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import FeedbackButton from "@/components/FeedbackButton";
import { DevtoolsProvider } from 'creatr-devtools';
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Strategic Analysis Tool",
    template: "%s | Strategic Analysis Tool"
  },
  description: "IFE & EFE Matrix Analysis Tool for Strategic Management",
  applicationName: "Strategic Analysis Tool",
  keywords: ["strategic analysis", "IFE matrix", "EFE matrix", "business strategy", "strategy tool", "management tool"],
  authors: [{
    name: "Strategic Analysis Team"
  }],
  creator: "Strategic Analysis Team",
  publisher: "Strategic Analysis Team",
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    }, {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon"
    }],
    apple: [{
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Strategic Analysis Tool"
  },
  formatDetection: {
    telephone: false
  }
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} data-unique-id="21f7955f-8217-4470-9688-a8d5a22cbc50" data-file-name="app/layout.tsx">
      
  <body className="min-h-screen bg-[#f8fafc]" data-unique-id="307ea6a9-09fd-491d-ab59-2feb171ad538" data-file-name="app/layout.tsx">
        <DevtoolsProvider>{children}</DevtoolsProvider>
        <FeedbackButton />
      </body>

    </html>;
}