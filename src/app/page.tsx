"use client";

// import { useState } from "react";
// import Resume from "@/components/Resume/Resume";
// import LineRiderGame from "@/components/LineRider/LineRiderGame";
import Gen from "@/components/Gen";

export default function Home() {
  // const [isAIActive, setIsAIActive] = useState(true);

  // const toggleAI = () => {
  //   setIsAIActive(!isAIActive);
  // };

  return (
    <div className="relative min-h-screen">
      {/* [Temp Joke */}
      <Gen />
  
      {/* Main Resume Content */}
      {/* <Resume /> */}

      {/* Line Rider Game Overlay */}
      {/* <LineRiderGame isAIActive={isAIActive} onToggleAI={toggleAI} /> */}

      {/* Welcome Message */}
      {/* <div className="fixed top-4 right-4 max-w-sm pointer-events-none z-20">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 dark:text-white mb-2">
            Welcome to My Interactive Resume!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Watch the AI learn to play Line Rider while you browse my resume
          </p>
        </div>
      </div> */}
    </div>
  );
}
