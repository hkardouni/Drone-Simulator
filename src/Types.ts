export type Direction = "NORTH" | "EAST" | "SOUTH" | "WEST"

export interface DroneState {
    x: number,
    y: number,
    direction: Direction,
    isFlying: boolean
}