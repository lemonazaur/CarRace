import React, { useState, useEffect } from 'react';
import { Car } from '../types'; // Import Car type definition
import "../styles/GaragePage.css"

const GaragePage: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [newCarName, setNewCarName] = useState<string>();
    const [selectedCar, setSelectedCar] = useState<Car>();

    useEffect(() => {
        fetchCars();
    }, []);

    // Function to fetch cars from the backend
    const fetchCars = async () => {
        try {
            const response = await fetch('http://localhost:3000/garage');
            if (!response.ok) {
                throw new Error('Failed to fetch cars');
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
            const response = await fetch('http://localhost:3000/garage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCarName, color: "#FFFFFF" }),
            });

            if (!response.ok) {
                throw new Error('Failed to add car');
            }
            // Fetch updated cars after adding the new car
            fetchCars();
        } catch (error) {
            console.error('Error adding car:', error);
        }
    };

    // Function to remove a car from the garage
    const removeCar = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete car with id ${id}`);
            }
            // Fetch updated cars after adding the new car
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const changeCar = async () =>{
        try {
            const response = await fetch(`http://localhost:3000/garage/${selectedCar?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCarName, color: "#FFFFFF" }),
            });

            if (!response.ok) {
                throw new Error('Failed to change car');
            }
            // Fetch updated cars after adding the new car
            fetchCars();
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