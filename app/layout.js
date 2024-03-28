import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@components/Navbar";

const inter = Inter({ subsets: ["latin"] });

// I have used Rigi Logo as an opengraph image
export const metadata = {
  metadataBase: "http://localhost:3000",
  title: {
    default: "Custom Video Player | Atishay",
    template: `%s | Atishay`,
  },
  description:
    "Custom video player create by Atishay with all functionalities.",
  openGraph: {
    title: "Custom Video Player | Atishay",
    description:
      "Custom video player create by Atishay with all functionalities.",
    url: "/",
    siteName: "RiseUpp",
    images: [
      {
        url: "https://app.rigi.club/wp-content/themes/Rigi/assets/img/logo.svg",
        width: 110,
        height: 45,
        alt: "Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Video Player | Atishay",
    description:
      "Custom video player create by Atishay with all functionalities.",
    creator: "@riseupp123",
    images: [
      "https://app.rigi.club/wp-content/themes/Rigi/assets/img/logo.svg",
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Suppressing any unwanted hydration warning */}
      <body className={inter.className} suppressHydrationWarning={true}>
        {/* It is dummy Navbar */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
