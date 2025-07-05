import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function MockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Theme accentColor="teal" grayColor="slate" radius="large" scaling="100%">
      {children}
    </Theme>
  );
}
