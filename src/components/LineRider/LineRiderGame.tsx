"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";
import { LineRiderAI } from "./LineRiderAI";

interface LineRiderGameProps {
  isAIActive: boolean;
  onToggleAI: () => void;
}

interface RiderState {
  score: number;
  flips: number;
  airTime: number;
  isGrounded: boolean;
  velocity: number;
}

export default function LineRiderGame({
  isAIActive,
  onToggleAI,
}: LineRiderGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const riderRef = useRef<Matter.Body | null>(null);
  const [riderState, setRiderState] = useState<RiderState>({
    score: 0,
    flips: 0,
    airTime: 0,
    isGrounded: true,
    velocity: 0,
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnLines, setDrawnLines] = useState<Matter.Body[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const currentPathRef = useRef<{ x: number; y: number }[]>([]);

  // Update ref whenever currentPath changes
  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);
  const aiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const aiRef = useRef<LineRiderAI>(new LineRiderAI());
  const [aiStats, setAIStats] = useState({
    generation: 0,
    bestScore: 0,
    currentStrategy: 0,
    totalStrategies: 0,
    mutationRate: 0,
    averageScore: 0,
  });
  const generationTimeRef = useRef<number>(0);
  const maxGenerationTime = 30000; // 30 seconds per generation

  const riderImgRef = useRef<HTMLImageElement | null>(null);
  const riderImgLoadedRef = useRef<boolean>(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = "/rider.png";

    img.onload = () => {
      riderImgLoadedRef.current = true;
    };

    img.onerror = (error) => {
      console.error("Failed to load rider image:", error);
      riderImgLoadedRef.current = false;
    };

    riderImgRef.current = img;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create Matter.js engine
    const engine = Matter.Engine.create();
    engine.gravity.y = 0.8;
    engineRef.current = engine;

    // Create runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Create rider (circle)
    const rider = Matter.Bodies.circle(100, 100, 15, {
      restitution: 0.3,
      friction: 0.8,
      frictionAir: 0.01,
      density: 0.001,
    });
    riderRef.current = rider;

    Matter.World.add(engine.world, [rider]);

    // Start runner
    Matter.Runner.run(runner, engine);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render all bodies
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach((body) => {
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        if (body === rider) {
          const img = riderImgRef.current;

          if (img && riderImgLoadedRef.current) {
            ctx.drawImage(img, -30, -30, 60, 60);
          } else {
            ctx.fillStyle = "#ff6b6b";
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2); // 2x radius
            ctx.fill();
          }
        } else {
          ctx.fillStyle = "#333";
          const vertices = body.vertices;
          ctx.beginPath();
          ctx.moveTo(
            vertices[0].x - body.position.x,
            vertices[0].y - body.position.y
          );
          for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(
              vertices[i].x - body.position.x,
              vertices[i].y - body.position.y
            );
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // Update rider state
      if (riderRef.current) {
        const velocity = Math.sqrt(
          Math.pow(riderRef.current.velocity.x, 2) +
            Math.pow(riderRef.current.velocity.y, 2)
        );

        // Check if rider has fallen off screen
        const riderY = riderRef.current.position.y;
        const riderX = riderRef.current.position.x;
        const canvasHeight = canvas.height;
        const canvasWidth = canvas.width;

        // Reset if rider falls too far below screen or goes too far off sides
        if (
          riderY > canvasHeight + 200 ||
          riderX < -200 ||
          riderX > canvasWidth + 200
        ) {
          // Reset rider position
          Matter.Body.setPosition(riderRef.current, { x: 100, y: 100 });
          Matter.Body.setVelocity(riderRef.current, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(riderRef.current, 0);

          // Reset some state but keep score accumulating
          setRiderState((prev) => ({
            ...prev,
            velocity: 0,
            flips: 0,
            airTime: 0,
            isGrounded: true,
          }));
        } else {
          setRiderState((prev) => ({
            ...prev,
            velocity: velocity,
            score: prev.score + (velocity > 2 ? 1 : 0),
          }));
        }
      }

      // Draw current path being drawn (preview)
      if (currentPathRef.current.length > 1) {
        ctx.strokeStyle = "#4ecdc4";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(currentPathRef.current[0].x, currentPathRef.current[0].y);

        for (let i = 1; i < currentPathRef.current.length; i++) {
          ctx.lineTo(currentPathRef.current[i].x, currentPathRef.current[i].y);
        }

        ctx.stroke();
      }

      requestAnimationFrame(render);
    };

    render();

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, []);

  const resetGame = useCallback(() => {
    if (!engineRef.current || !canvasRef.current) return;

    // Remove all drawn lines
    drawnLines.forEach((line) => {
      if (engineRef.current) {
        Matter.World.remove(engineRef.current.world, line);
      }
    });
    setDrawnLines([]);

    setCurrentPath([]);
    setIsDrawing(false);

    // Reset rider position
    if (riderRef.current) {
      Matter.Body.setPosition(riderRef.current, { x: 100, y: 100 });
      Matter.Body.setVelocity(riderRef.current, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(riderRef.current, 0);
    }

    // Reset state
    setRiderState({
      score: 0,
      flips: 0,
      airTime: 0,
      isGrounded: true,
      velocity: 0,
    });

    // Reset AI if needed
    if (isAIActive) {
      aiRef.current.reset();
      setAIStats(aiRef.current.getAIStats());
    }
  }, [drawnLines, isAIActive]);

  // AI Logic
  useEffect(() => {
    if (!isAIActive || !canvasRef.current || !engineRef.current) return;

    generationTimeRef.current = Date.now();

    const aiLoop = () => {
      if (!riderRef.current || !canvasRef.current || !engineRef.current) return;

      const rider = riderRef.current;
      const riderPosition = rider.position;
      const riderVelocity = rider.velocity;

      // Get AI decision
      const action = aiRef.current.getNextAction(riderPosition, riderVelocity);

      if (action) {
        if (action.type === "line") {
          // Create AI line
          const line = Matter.Bodies.rectangle(action.x, action.y, 80, 8, {
            isStatic: true,
            angle: action.angle || 0,
            render: { fillStyle: "#00ff88" }, // Green for AI lines
          });

          if (engineRef.current) {
            Matter.World.add(engineRef.current.world, line);
            setDrawnLines((prev) => [...prev, line]);
          }
        } else if (action.type === "force" && action.force) {
          // Apply force to rider
          Matter.Body.applyForce(rider, riderPosition, action.force);
        }
      }

      // Update AI with current performance
      const isInAir = Math.abs(riderVelocity.y) > 0.1;

      aiRef.current.updateScore(
        riderState.score,
        riderState.flips,
        isInAir ? 1 : 0
      );

      // Update AI stats
      setAIStats(aiRef.current.getAIStats());

      // Check if generation time is up
      if (Date.now() - generationTimeRef.current > maxGenerationTime) {
        aiRef.current.evolve();
        generationTimeRef.current = Date.now();

        // Reset the world for new generation
        resetGame();
      }
    };

    aiIntervalRef.current = setInterval(aiLoop, 300);

    return () => {
      if (aiIntervalRef.current) {
        clearInterval(aiIntervalRef.current);
      }
    };
  }, [isAIActive, riderState, resetGame]);

  // Helper function to create a continuous line from points
  const createContinuousLine = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return null;

    const bodies: Matter.Body[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];

      const centerX = (start.x + end.x) / 2;
      const centerY = (start.y + end.y) / 2;
      const length = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      const angle = Math.atan2(end.y - start.y, end.x - start.x);

      if (length > 2) {
        // Only create segments that are meaningful
        const segment = Matter.Bodies.rectangle(centerX, centerY, length, 8, {
          isStatic: true,
          angle: angle,
          render: { fillStyle: "#4ecdc4" },
          friction: 0.8,
          frictionStatic: 0.9,
          restitution: 0.1,
        });
        bodies.push(segment);
      }
    }

    return bodies;
  };

  // Handle manual drawing
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || isAIActive || !canvasRef.current || !engineRef.current)
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add point to current path
    setCurrentPath((prev) => {
      const newPath = [...prev, { x, y }];

      // Only add segments when we have at least 2 points and meaningful distance
      if (newPath.length >= 2) {
        const lastPoint = newPath[newPath.length - 2];
        const distance = Math.sqrt(
          Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
        );

        if (distance >= 8) {
          // Minimum distance between points for smooth drawing
          return newPath;
        } else {
          // Replace the last point instead of adding a new one if too close
          return [...prev.slice(0, -1), { x, y }];
        }
      }

      return newPath;
    });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length >= 2 && engineRef.current) {
      // Create the continuous line from the current path
      const lineSegments = createContinuousLine(currentPath);
      if (lineSegments && lineSegments.length > 0) {
        // Add all segments to the physics world
        Matter.World.add(engineRef.current.world, lineSegments);
        setDrawnLines((prev) => [...prev, ...lineSegments]);
      }
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAIActive) return;
    setIsDrawing(true);

    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentPath([{ x, y }]); // Start a new path
  };

  // Add touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAIActive) return;
    setIsDrawing(true);

    const rect = canvasRef.current!.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setCurrentPath([{ x, y }]); // Start a new path
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing || isAIActive || !canvasRef.current || !engineRef.current)
      return;

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0]; // Get the first touch point
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Add point to current path
    setCurrentPath((prev) => {
      const newPath = [...prev, { x, y }];

      // Only add segments when we have at least 2 points and meaningful distance
      if (newPath.length >= 2) {
        const lastPoint = newPath[newPath.length - 2];
        const distance = Math.sqrt(
          Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2)
        );

        if (distance >= 8) {
          // Minimum distance between points for smooth drawing
          return newPath;
        } else {
          // Replace the last point instead of adding a new one if too close
          return [...prev.slice(0, -1), { x, y }];
        }
      }

      return newPath;
    });
  };

  const handleTouchEnd = () => {
    if (isDrawing && currentPath.length >= 2 && engineRef.current) {
      // Create the continuous line from the current path
      const lineSegments = createContinuousLine(currentPath);
      if (lineSegments && lineSegments.length > 0) {
        // Add all segments to the physics world
        Matter.World.add(engineRef.current.world, lineSegments);
        setDrawnLines((prev) => [...prev, ...lineSegments]);
      }
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 ${!isAIActive ? "pointer-events-auto" : ""}`}
        style={{
          background: "transparent",
          mixBlendMode: "multiply",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Game UI */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white text-sm space-y-2">
          <div>Score: {riderState.score}</div>
          <div>Velocity: {riderState.velocity.toFixed(1)}</div>
          <div>Flips: {riderState.flips}</div>
          {isAIActive && (
            <>
              <div className="border-t border-white/20 pt-2">
                <div className="text-xs font-bold mb-1">AI Learning</div>
                <div>Gen: {aiStats.generation}</div>
                <div>Best: {aiStats.bestScore.toFixed(0)}</div>
                <div>
                  Strategy: {aiStats.currentStrategy + 1}/
                  {aiStats.totalStrategies}
                </div>
                <div>Mutation: {(aiStats.mutationRate * 100).toFixed(1)}%</div>
                <div>Avg Score: {aiStats.averageScore.toFixed(0)}</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="absolute bottom-4 right-4 pointer-events-auto flex gap-2">
        <button
          onClick={onToggleAI}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isAIActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isAIActive ? "Take Control" : "AI Control"}
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
