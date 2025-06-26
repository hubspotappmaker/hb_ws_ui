import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import StyledComponentsRegistry from "@/lib/registry/registry";


export const metadata: Metadata = {
  title: "Google Drive Sync Hubspot Application",
  description: "Google Drive Sync Hubspot Application",
  icons: {
    icon: '/favicon.ico',
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
        <StyledComponentsRegistry>
          <AntdRegistry>{children}</AntdRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
