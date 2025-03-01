"use client";
import { useState } from "react";
import { DroneState, Direction } from "@/Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DIRECTIONS: Direction[] = ["NORTH", "EAST", "SOUTH", "WEST"];

const DroneSimulator = () => {
  const [drone, setDrone] = useState<DroneState>({
    x: 0,
    y: 0,
    direction: "NORTH",
    isFlying: false,
  });

  const [xInput, setXInput] = useState<string>("");
  const [yInput, setYInput] = useState<string>("");
  const [rotationDirection, setRotationDirection] = useState<"LEFT" | "RIGHT">(
    "LEFT"
  );

  const [command, setCommand] = useState<string>("READY TO GO!")

  const isLaunchEnabled =
    xInput &&
    yInput &&
    !isNaN(Number(xInput)) &&
    !isNaN(Number(yInput)) &&
    parseInt(xInput) >= 0 &&
    parseInt(xInput) <= 4 &&
    parseInt(yInput) >= 0 &&
    parseInt(yInput) <= 4;

  const handleCommand = (command: string) => {
    const parts = command.trim().split(" ");

    switch (parts[0]) {
      case "LAUNCH":
        if (parts.length === 2) {
          const [initX, initY, initDir] = parts[1].split(",");
          const [x, y, dir] = [
            parseInt(initX),
            parseInt(initY),
            initDir as Direction,
          ];
          if (
            x >= 0 &&
            x <= 4 &&
            y >= 0 &&
            y <= 4 &&
            DIRECTIONS.includes(dir)
          ) {
            setDrone({ x, y, direction: dir, isFlying: true });
            toast.success("Drone Launched Successfully!");
          } else {
            toast.error("Invalid coordinates or direction!");
          }
        }
        break;
      case "FLY":
        if (drone.isFlying) {
          // eslint-disable-next-line prefer-const
          let { x, y, direction } = drone;
          console.log(x, y, direction)
          if ((x == 4 && direction === "EAST") || (x == 0 && direction === "WEST") || (y <= 0 && direction === "NORTH") || (y >= 4 && direction === "SOUTH")) {
            toast.error("Drone can't move outside the area!")
          } else {
            if (direction === "SOUTH" && y <= 4) y++;
            if (direction === "NORTH" && y >= 0) y--;
            if (direction === "WEST" && x <= 4) x--;
            if (direction === "EAST" && x >= 0) x++;
            setDrone({ x, y, direction, isFlying: true });
            toast.info("Drone moved!");
          }
        } else {
          toast.warning("Drone is not launched yet!");
        }
        break;
      case "LEFT":
        {
          const newDirIndex = (DIRECTIONS.indexOf(drone.direction) + 3) % 4;
          setDrone({ ...drone, direction: DIRECTIONS[newDirIndex] });
          toast.info("Drone turned left!");
        }
        break;
      case "RIGHT":
        {
          const newDirIndex = (DIRECTIONS.indexOf(drone.direction) + 1) % 4;
          setDrone({ ...drone, direction: DIRECTIONS[newDirIndex] });
          toast.info("Drone turned right!");
        }
        break;
      case "STATUS":
        toast.info(
          `Drone is at (${drone.x}, ${drone.y}) facing ${drone.direction}`
        );
        break;
      default:
        toast.error("Invalid Command!");
    }
  };

  const resetDronePosition = () => {
    setDrone({
      x: 0,
      y: 0,
      direction: "NORTH",
      isFlying: false,
    });
    setXInput("");
    setYInput("");
    toast.success("Drone position reset to start!");
  };

  const createGrid = () => {
    const grid = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push(
          <div
            key={`${i}-${j}`}
            className="w-12 h-12 border border-gray-300 relative"
          >
            {drone.x === j && drone.y === i && (
              <div className="w-6 h-6 bg-green-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className={`absolute top-1/2 left-1/2 w-0 h-0 transform ${drone.direction === "NORTH"
                    ? "rotate-270 -translate-x-2"
                    : drone.direction === "EAST"
                      ? "rotate-0 -translate-y-2"
                      : drone.direction === "SOUTH"
                        ? "rotate-90 translate-x-2"
                        : "rotate-180 translate-y-2"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-4 h-4 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      }
      grid.push(
        <div key={i} className="flex">
          {row}
        </div>
      );
    }
    return grid;
  };

  const handleRotation = () => {
    if (rotationDirection === "LEFT") {
      const newDirIndex = (DIRECTIONS.indexOf(drone.direction) + 3) % 4;
      setDrone({ ...drone, direction: DIRECTIONS[newDirIndex] });
      setCommand("LEFT");
      toast.info("Drone turned left!");
    } else if (rotationDirection === "RIGHT") {
      const newDirIndex = (DIRECTIONS.indexOf(drone.direction) + 1) % 4;
      setDrone({ ...drone, direction: DIRECTIONS[newDirIndex] });
      setCommand("RIGHT")
      toast.info("Drone turned right!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          Drone Simulator
        </h1>

        {/* Coordinates Input */}
        <div className="flex space-x-4 mb-4">
          <input
            type="number"
            value={xInput}
            onChange={(e) => setXInput(e.target.value)}
            placeholder="Enter X (0-4)"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            value={yInput}
            onChange={(e) => setYInput(e.target.value)}
            placeholder="Enter Y (0-4)"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Launch Button */}
        <button
          onClick={() => {
            handleCommand(`LAUNCH ${xInput},${yInput},${drone.direction}`);
            setCommand(`LAUNCH ${xInput},${yInput},${drone.direction}`);
          }}
          disabled={!isLaunchEnabled}
          className={`w-full py-3 mb-4 ${isLaunchEnabled ? "bg-green-500" : "bg-gray-300"
            } text-white rounded-lg`}
        >
          Launch Drone
        </button>

        {/* Rotation Dropdown (LEFT/RIGHT) */}
        <div className="mb-4">
          <select
            value={rotationDirection}
            onChange={(e) =>
              setRotationDirection(e.target.value as "LEFT" | "RIGHT")
            }
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="LEFT">Left</option>
            <option value="RIGHT">Right</option>
          </select>
        </div>

        {/* Apply Rotation Button */}
        <button
          onClick={handleRotation}
          className="w-full py-3 bg-blue-500 text-white rounded-lg mb-4"
        >
          Apply Rotation
        </button>

        {/* Fly Button */}
        <button
          onClick={() => {
            handleCommand("FLY");
            setCommand("FLY");
          }}
          disabled={!drone.isFlying}
          className={`w-full py-3 ${drone.isFlying ? "bg-blue-500" : "bg-gray-300"
            } text-white rounded-lg`}
        >
          Fly Drone
        </button>

        <button
          onClick={() => {
            handleCommand("STATUS");
            setCommand("STATUS");
          }}
          className={"w-full mt-3 py-3 bg-green-500 text-white rounded-lg"}
        >
          Drone Status
        </button>
        <button
          onClick={() => toast.info(`The command is: ${command}`)}
          className={"w-full mt-3 py-3 bg-indigo-500 text-white rounded-lg"}
        >
          Last Command
        </button>

        {/* Coordinate Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-center">
            Coordinate Grid
          </h2>
          <div className="flex justify-center">
            <div className="inline-block">{createGrid()}</div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetDronePosition}
            className="px-6 py-2 bg-red-500 text-white rounded-full"
          >
            Reset Drone
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default DroneSimulator;
