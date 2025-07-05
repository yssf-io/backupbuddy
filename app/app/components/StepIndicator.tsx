import React from "react";
import { Flex, Text, Box } from "@radix-ui/themes";

export interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

export default function StepIndicator({
  steps,
  currentStepId,
  className = "",
}: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);

  return (
    <Box style={{ textAlign: "center" }} className={className}>
      <Flex gap="2" align="center" justify="center" wrap="wrap">
        {steps.map((step, index) => {
          const isActive = step.id === currentStepId;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <Box
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor:
                    isActive || isCompleted ? "var(--teal-9)" : "var(--gray-6)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}>
                {index + 1}
              </Box>
              <Text
                size="2"
                style={{
                  color:
                    isActive || isCompleted
                      ? "var(--teal-11)"
                      : "var(--gray-11)",
                  fontWeight: isActive ? "600" : "400",
                }}>
                {step.label}
              </Text>
              {index < steps.length - 1 && (
                <Box
                  style={{
                    width: "20px",
                    height: "2px",
                    backgroundColor: isCompleted
                      ? "var(--teal-9)"
                      : "var(--gray-6)",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Flex>
    </Box>
  );
}
