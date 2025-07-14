"use client";

import { useState } from "react";
import Resume from "@/components/Resume/Resume";
import LineRiderGame from "@/components/LineRider/LineRiderGame";

export default function Home() {
  const [isAIActive, setIsAIActive] = useState(true);

  const toggleAI = () => {
    setIsAIActive(!isAIActive);
  };

  return (
    <div className="relative min-h-screen">
      {/* Main Resume Content */}
      <Resume />

      {/* Line Rider Game Overlay */}
      <LineRiderGame isAIActive={isAIActive} onToggleAI={toggleAI} />
    </div>
  );
}
