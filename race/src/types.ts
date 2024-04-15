export interface Car {
    id: number;
    name: string;
    color: string;
}

export interface Winner {
    id: number;
    wins: number;
    time: number;
}

export interface CarCardProps {
    car: Car;
    removeCar: (id: number) => void;
    setSelectedCar: (car: Car) => void;
    startEngine: (id:number) => void;
    stopEngine: (id:number) => void;
}

export interface winnerInfo {
    id: number;
    wins: number;
    time: number;
    name: string;
    color: string;
}