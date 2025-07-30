import type { Metadata } from "next";
import Script from "next/script";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyledComponentsRegistry from "@/lib/registry/registry";
import Clarity from "@/component/setting/clarity";

export const metadata: Metadata = {
  title: "Google Drive Sync Hubspot Application",
  description: "Google Drive Sync Hubspot Application",
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <style>{`
          ::-webkit-scrollbar {
            display: none;
          }
          html {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <Script
          type="text/javascript"
          id="hs-script-loader"
          async
          defer
          src="//js.hs-scripts.com/243127684.js"
        />
        <StyledComponentsRegistry>
          <Clarity />
          <AntdRegistry>{children}</AntdRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
