import type { Metadata } from "next";
import "@styles/globals.css";
import Nav from "@components/Nav";
import { Suspense } from "react";
import Loading from "./loading";
import Head from "next/head";

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
      <Head>
        <meta
          http-equiv='Content-Security-Policy'
          content='upgrade-insecure-requests'
        />
      </Head>
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
