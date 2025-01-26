import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Huddle-Up",
  description: "A video conferencing platform",
  icons: {
    icon: "/icons/logo.svg",
  }
};

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
