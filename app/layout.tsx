import type { Metadata } from "next";
import "@styles/globals.css";
import Nav from "@components/Nav";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "PixelPerfect - Image Editor",
  description: "Transform Your Images with Precision",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta
          httpEquiv='Content-Security-Policy'
          content='upgrade-insecure-requests'
        />
      </head>
      <body>
        <Suspense fallback={<Loading />}>
          <main className='app'>
            <Nav />
            {children}
          </main>
        </Suspense>
      </body>
    </html>
  );
}
