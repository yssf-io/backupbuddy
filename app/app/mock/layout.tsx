import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ToastProvider } from "../contexts/ToastContext";
import { Toaster } from "@/components/ui/toaster";

export default function MockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Theme accentColor="teal" grayColor="slate" radius="large" scaling="100%">
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </Theme>
  );
}
