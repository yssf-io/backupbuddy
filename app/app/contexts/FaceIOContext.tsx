"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { FaceIOInstance } from "../types/faceio"; // Reuse our type definition

// Define the shape of the context data
interface FaceIOContextType {
  faceio: FaceIOInstance | null;
}

// Create the context with a default value of null
const FaceIOContext = createContext<FaceIOContextType | null>(null);

// Create a provider component
export const FaceIOProvider = ({ children }: { children: ReactNode }) => {
  const [faceio, setFaceio] = useState<FaceIOInstance | null>(null);

  // This function will be called by the Script's onLoad callback
  const onReady = () => {
    console.log("FaceIO script loaded and ready.");
    if (window.faceIO) {
      setFaceio(new window.faceIO(process.env.NEXT_PUBLIC_FACEIO_PUBLIC_ID!));
    }
  };

  return (
    <FaceIOContext.Provider value={{ faceio }}>
      {/* The onReady function is passed to a special Script component in the layout */}
      <div id="faceio-ready" data-onready="onReady" />
      {children}
    </FaceIOContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useFaceIO = () => {
  const context = useContext(FaceIOContext);
  if (!context) {
    throw new Error("useFaceIO must be used within a FaceIOProvider");
  }
  return context;
};
