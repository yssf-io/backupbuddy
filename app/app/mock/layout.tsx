import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ToastProvider } from "../contexts/ToastContext";
import { Toaster } from "@/components/ui/toaster";
import { Flex, Text, Heading, Container, Box } from "@radix-ui/themes";

export default function MockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Theme accentColor="teal" grayColor="slate" radius="large" scaling="100%">
      <ToastProvider>
        <Container size="2" p="6">
          <Flex direction="column" gap="6" align="center">
            {/* Header */}
            <Box style={{ textAlign: "center" }}>
              <Heading size="8" mb="2">
                BackupBuddy
              </Heading>
              <Text size="5" color="gray">
                Social Recovery 4 Everyone
              </Text>
            </Box>
            {children}
          </Flex>
        </Container>
        <Toaster />
      </ToastProvider>
    </Theme>
  );
}
