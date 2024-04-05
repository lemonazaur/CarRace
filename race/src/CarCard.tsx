import React from 'react';
import { CarCardProps } from "./types";
import "./styles/CarCard.css";
import { FaCarSide } from "react-icons/fa6";

const CarCard: React.FC<CarCardProps> = ({ car, removeCar, setSelectedCar }) => {
    return (
        <div>
            <div className="line">
                <div key={car.id} className="info">
                    <button>START</button>
                    <button>END</button>
                </div>


                <div key={car.id} className="info">
                    <button onClick={() => removeCar(car.id)}>Delete</button>
                    <button onClick={() => setSelectedCar(car)}>Select</button>
                </div>
                <FaCarSide className="car" style={{ width: '100px', height: '150px', color: car.color }} />
                <p>{car.name}</p>
            </div>
            <hr/>
        </div>
    );
};

export default CarCard;
