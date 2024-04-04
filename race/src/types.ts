export interface Car {
    id: number;
    name: string;
    color: string;
}

export interface Winner {
    id: number;
    carId: number;
    name: string;
    wins: number;
    bestTime: number;
}