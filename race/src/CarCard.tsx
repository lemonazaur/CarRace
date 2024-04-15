import React, {useState} from 'react';
import { CarCardProps } from "./types";
import "./styles/CarCard.css";
import { FaCarSide } from "react-icons/fa6";

const CarCard: React.FC<CarCardProps> = ({ car, removeCar, setSelectedCar, startEngine, stopEngine }) => {
    const [position, setPosition] = useState<'start' | 'end'>('start');

    return (
        <div key={car.id} className="line">
            <div  className="toolSet">
                <button onClick={() => startEngine(car.id)}>START</button>
                <button onClick={() => stopEngine(car.id)}>STOP</button>
            </div>
            <div  className="toolSet">
                <button onClick={() => removeCar(car.id)}>Delete</button>
                <button onClick={() => setSelectedCar(car)}>Select</button>
            </div>

            <FaCarSide id={`car-${car.id}`} style={{ height: '100px', width : '70px', color: car.color }} />
            <p>{car.name}</p>
        </div>
    );
};

export default CarCard;