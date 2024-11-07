import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

const music = new Audio("/backgroundAudio.mp3");

const lightsOnUrl = "http://192.168.1.199:8080/walkInOn";
const lightsOffUrl = "http://192.168.1.199:8080/walkInOff";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function lightsOn(
  setupState: boolean,
  setSetupState: (state: boolean) => void
) {
  if (setupState) return;

  try {
    // Turn on lights
    const result = await invoke("toggle_light", { endpoint: lightsOnUrl });
    console.log("Lights On response:", result);
    setSetupState(true);
  } catch (error) {
    console.error("Error turning lights on:", error);
  }
}

async function lightsOff(
  setupState: boolean,
  setSetupState: (state: boolean) => void
) {
  if (!setupState) return;

  try {
    // Turn off lights
    const result = await invoke("toggle_light", { endpoint: lightsOffUrl });
    console.log("Lights Off response:", result);
    setSetupState(false);
  } catch (error) {
    console.error("Error turning lights off:", error);
  }
}

function musicOn(setupState: boolean, setSetupState: (state: boolean) => void) {
  if (setupState) return;

  // Play music on loop
  music.loop = true;
  music.play();

  setSetupState(true);
}

function musicOff(
  setupState: boolean,
  setSetupState: (state: boolean) => void
) {
  if (!setupState) return;

  // Stop music
  music.pause();

  setSetupState(false);
}

export function Index() {
  const [setupState, setSetupState] = useState(false);

  useEffect(() => {
    setupOn();
  }, []);

  async function setupOn() {
    await lightsOn(setupState, setSetupState);
    await sleep(100);
    musicOn(setupState, setSetupState);
  }

  async function setupOff() {
    musicOff(setupState, setSetupState);
    await sleep(100);
    await lightsOff(setupState, setSetupState);
  }

  return (
    <div className="h-screen flex gap-x-8 justify-center items-center">
      <Button onClick={() => setupOn()}>Lights On</Button>
      <Button onClick={() => setupOff()}>Lights Off</Button>
    </div>
  );
}
