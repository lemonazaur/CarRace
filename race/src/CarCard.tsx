import React from 'react';
import { CarCardProps } from "./types";
import "./styles/CarCard.css";
import { FaCarSide } from "react-icons/fa6";

const CarCard: React.FC<CarCardProps> = ({ car, removeCar, setSelectedCar }) => {

    const race = () =>{
        //todo: make it so the individual car races
    }


    return (
        <div>
            <div className="line">
                <div key={car.id} className="line">
                    <div className="toolSet">
                        <button>START</button>
                        <button>STOP</button>
                    </div>
                    <div className="toolSet">
                        <button onClick={() => removeCar(car.id)}>Delete</button>
                        <button onClick={() => setSelectedCar(car)}>Select</button>
                    </div>
                </div>

                <FaCarSide className="car" style={{ width: '100px', height: '70px', color: car.color }} />
                <p>{car.name}</p>
            </div>
            <hr/>
        </div>
    );
};

export default CarCard;