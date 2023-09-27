import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/common/Navbar";
import { NotificationProvider } from "./providers/NotificationProvider";
import Script from "next/script";
import { ReduxProvider } from "@/redux/provider";

export const metadata: Metadata = {
  title: "Invoice Rocket",
  description: "Fast and easy invoicing for freelancers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full flex flex-col flex-1">
        <ReduxProvider>
          <NotificationProvider>
            <Navbar />
            <main>
              <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </NotificationProvider>
        </ReduxProvider>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js" />
      </body>
    </html>
  );
}
