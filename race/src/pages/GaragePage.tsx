import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import "../styles/GaragePage.css";

const GaragePage: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [newCarName, setNewCarName] = useState<string>();
    const [selectedCar, setSelectedCar] = useState<Car>();
    const [newColor, setNewColor] = useState<string>("#FFFFFF");

    useEffect(() => {
        fetchCars();
    }, []);

    // Function to fetch cars from the backend (runs on port 3000)
    const fetchCars = async () => {
        try {
            const response = await fetch('http://localhost:3000/garage');
            if (!response.ok) {
                throw new Error('Bad response');
            }
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to add a new car to the garage
    const addCar = async () => {
        try {
            if(newCarName){
                const response = await fetch('http://localhost:3000/garage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newCarName, color: newColor }),
                });

                if (!response.ok) {
                    throw new Error('Bad response');
                }
                // Fetch updated cars after adding the new car
                fetchCars();
                console.log(`Added a car {name: ${newCarName}, color: ${newColor}}`)
            }else{
                throw new Error('Empty name');
            }
        } catch (error) {
            console.error('Error adding car:', error);
        }
    };

    // Function to remove a car from the garage
    const removeCar = async (id: number) => {
        try {
            if (id <= 0) {
                throw new Error(`Must have positive id`);
            } else {
                const response = await fetch(`http://localhost:3000/garage/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Bad response with ${id}`);
                }
                fetchCars();
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const changeCar = async () =>{
        try {
            if(selectedCar){
                const response = await fetch(`http://localhost:3000/garage/${selectedCar?.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newCarName, color: newColor}),
                });

                if (!response.ok) {
                    throw new Error('Bad response');
                }
                fetchCars();
            }else{
                throw new Error('No car selected ');
            }

        } catch (error) {
            console.error('Error change car:', error);
        }
    }

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
                    <input
                        type="text"
                        value={newCarName}
                        onChange={(e) => setNewCarName(e.target.value)}
                        placeholder="Enter car name"
                    />
                    <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                    />

                    <button onClick={() => changeCar()}>UPDATE</button>
                    <button onClick={addCar}>CREATE</button>
                </div>

                <button>GENERATE CARS</button>
            </div>
            <hr></hr>
            <div>
                {cars.map(car => (
                    <div key={car.id}>
                        <p>{car.name}  {car.color}</p>
                        <button onClick={() => removeCar(car.id)}>Delete</button>
                        <button onClick={() => setSelectedCar(car)}>Select</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GaragePage;