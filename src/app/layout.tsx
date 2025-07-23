import type { Metadata } from "next";
import Script from "next/script";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyledComponentsRegistry from "@/lib/registry/registry";

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
        {/* Clarity script */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c['ClarityObject']=i;c[i]=c[i]||function(){
                (c[i].q=c[i].q||[]).push(arguments)},c[i].l=1*new Date();
                t=l.createElement(a),t.async=1,t.src=r,y=l.getElementsByTagName(a)[0];
                y.parentNode.insertBefore(t,y)
              })(window, document, 'script', 'https://www.clarity.ms/tag/six6ppq4uu');
            `,
          }}
        />

        <StyledComponentsRegistry>
          <AntdRegistry>{children}</AntdRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
