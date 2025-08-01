import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ToastProvider } from "./contexts/ToastContext";
import { Toaster } from "@/components/ui/toaster";
import { Flex, Text, Heading, Container, Box } from "@radix-ui/themes";
import { Suspense } from "react";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BackupBuddy",
  description: "Never lose your Digital Assets with BackupBuddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <Theme
            accentColor="teal"
            grayColor="slate"
            radius="large"
            scaling="100%"
          >
            <ToastProvider>
              <Container size="3" p="6">
                <Flex direction="column" gap="6" align="center">
                  {/* Header */}
                  <Box style={{ textAlign: "center" }}>
                    <Heading size="8" mb="2">
                      BackupBuddy
                    </Heading>
                    <Text size="5" color="gray">
                      Never lose your Digital Assets
                    </Text>
                  </Box>
                  {children}
                </Flex>
              </Container>
              <Toaster />
            </ToastProvider>
          </Theme>
        </Suspense>
      </body>
    </html>
  );
}
