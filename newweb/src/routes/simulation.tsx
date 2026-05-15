'use client';

import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const BinarySystemScene = lazy(() => import("@/components/BinarySystemScene").then(m => ({ default: m.BinarySystemScene })));

export const Route = createFileRoute("/simulation")({
  component: SimulationRoute,
  head: () => ({
    meta: [
      { title: "Chaos Binary System Simulation" },
      { name: "description", content: "Explore the binary star system and its planets." },
    ],
  }),
});

function SimulationRoute() {
  return (
    <div className="min-h-screen bg-black">
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
        <BinarySystemScene />
      </Suspense>
    </div>
  );
}
