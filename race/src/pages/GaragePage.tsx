// GaragePage.tsx

import React, { useState, useEffect } from 'react';
import { Car } from '../types'; // Import Car type definition
import "../styles/GaragePage.css"

const GaragePage: React.FC = () => {
    // State for managing cars in the garage
    const [cars, setCars] = useState<Car[]>([]);

    useEffect(() => {
        let newCars :Car[] = [{id:1, name: 'honda', color: "blue" }];
        setCars(newCars);
    }, []);

    // Function to add a new car to the garage
    const addCar = () => {
        // Generate a random car object (replace with your logic)
        const newCar: Car = {
            id: Math.floor(Math.random() * 1000),
            name: `Car ${cars.length + 1}`,
            color: '#000000', // Default color
        };

        // Add the new car to the garage
        setCars([...cars, newCar]);
    };

    // Function to remove a car from the garage
    const removeCar = (id: number) => {
        // Filter out the car with the specified id
        const updatedCars = cars.filter(car => car.id !== id);
        // Update the cars state
        setCars(updatedCars);
    };

    return (
        <div>
            <hr></hr>
            <h1>Garage</h1>
            <div className="controls">
                <div>
                    <button>RACE</button>
                    <button>RESET</button>
                </div>

                <div className="createNewCar">
                    <input/>
                    <button onClick={addCar}>CREATE</button>
                </div>
                <div className="updateCar">
                    <input/>
                    <button>UPDATE</button>
                </div>
                <button>GENERATE CARS</button>
            </div>
            <hr></hr>
            <div>
                {cars.map(car => (
                    <div key={car.id}>
                        <span>{car.name}</span>
                        <span style={{ backgroundColor: car.color, width: '20px', height: '20px', display: 'inline-block' }}></span>
                        <button onClick={() => removeCar(car.id)}>Remove</button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default GaragePage;
