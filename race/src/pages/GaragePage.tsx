import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import "../styles/GaragePage.css";
import CarCard from "../CarCard";

const GaragePage: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [newCarName, setNewCarName] = useState<string>("");
    const [selectedCar, setSelectedCar] = useState<Car>();
    const [newColor, setNewColor] = useState<string>("#FFFFFF");

    const carBrands = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Nissan", "Hyundai", "Tesla", "Subaru", "Kia", "Lexus", "Porsche", "Jaguar", "Land Rover", "Jeep", "Mazda", "Fiat"];
    const carModels = [
        "Corolla", "Camry", "RAV4", "Highlander", "Tacoma", "Sienna", "Prius", "4Runner", "Tundra", "Avalon",
        "Accord", "Civic", "CR-V", "Pilot", "Odyssey", "Fit", "HR-V", "Ridgeline", "Insight", "Passport",
        "F-150", "Escape", "Explorer", "Focus", "Mustang", "Edge", "Ranger", "Fusion", "Expedition", "EcoSport",
        "Silverado", "Equinox", "Malibu", "Traverse", "Cruze", "Tahoe", "Suburban", "Colorado", "Bolt", "Impala",
        "3 Series", "5 Series", "X3", "X5", "X1", "7 Series", "X7", "X6", "4 Series", "X2",
        "C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class", "GLA", "CLA", "GLS", "G-Class",
        "A4", "Q5", "A3", "Q7", "Q3", "A6", "A5", "A7", "Q8", "A8",
        "Jetta", "Passat", "Tiguan", "Atlas", "Golf", "Arteon", "Atlas Cross Sport", "Golf GTI", "Touareg", "ID.4",
        "Altima", "Rogue", "Sentra", "Murano", "Pathfinder", "Versa", "Maxima", "Frontier", "Titan", "Kicks",
        "Elantra", "Tucson", "Santa Fe", "Sonata", "Kona", "Accent", "Palisade", "Veloster", "Venue", "Nexo",
        "Model 3", "Model S", "Model Y", "Model X", "Roadster", "Cybertruck", "Semi", "Powerwall", "Powerpack", "Solar Roof",
        "Outback", "Forester", "Impreza", "Legacy", "Crosstrek", "Ascent", "BRZ", "WRX", "Crosstrek Hybrid", "Forester Sport",
        "Soul", "Sportage", "Sorento", "Optima", "Forte", "Telluride", "Rio", "Stinger", "Cadenza", "Niro",
        "RX", "NX", "ES", "GX", "IS", "UX", "LC", "LS", "RC", "LX",
        "911", "Cayenne", "Macan", "Panamera", "Taycan", "Boxster", "Cayman", "718 Spyder", "718 Cayman GT4", "911 Turbo",
        "F-PACE", "XE", "F-TYPE", "XF", "I-PACE", "E-PACE", "XJ", "XK", "XE SV Project 8", "F-PACE SVR",
        "Range Rover", "Discovery", "Range Rover Sport", "Defender", "Discovery Sport", "Range Rover Evoque", "Range Rover Velar", "Freelander", "Series I", "Series II",
        "Wrangler", "Cherokee", "Grand Cherokee", "Renegade", "Compass", "Gladiator", "Commander", "Wagoneer", "Grand Wagoneer", "Liberty",
        "Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata", "CX-3", "MX-30", "RX-8", "RX-7", "CX-30",
        "500", "500X", "500L", "124 Spider", "500e", "500 Abarth", "Tipo", "Punto", "Freemont", "Talento"
    ];

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
            if(newCarName && newCarName.length < 16){
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
                throw new Error('Empty name or more than 16 characters');
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

    //Function to change selected car with current inputs
    const changeCar = async () =>{
        try {
            if(selectedCar){
                if(newCarName && newCarName.length < 16){
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
                    throw new Error('Empty name or more than 16 characters ');
                }
            }else{
                throw new Error('No car selected ');
            }

        } catch (error) {
            console.error('Error change car:', error);
        }
    }

    //Returns two combined random hex numbers. Example "d6"
    const hex = () => {
        return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }
    //Returns a random name : Brand + Model
    const name = () => {
        let index = Math.floor(Math.random() * 20);
        console.log(index)
        return carBrands[index] + " " + carModels[index*10 + Math.floor(Math.random() * 10)];
    }

    //Function to generate 100 cars for tests;
    const generateCars = async () => {
        for (let i = 0; i < 5; i++) {
            try {
                const response = await fetch('http://localhost:3000/garage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name(), color: `#${hex()}${hex()}${hex()}` }),
                });

                if (!response.ok) {
                    throw new Error('Bad response');
                }
                console.log(`Added a car {name: ${newCarName}, color: ${newColor}}`)
            } catch (error) {
                console.error('Error adding car:', error);
            }
        }
        fetchCars()
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
                        onChange={(e) => setNewCarName(e.target.value.toUpperCase())}
                        placeholder="Enter car name"
                    />
                    <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                    />

                    <button onClick={changeCar}>UPDATE</button>
                    <button onClick={addCar}>CREATE</button>
                </div>

                <button onClick={generateCars}>GENERATE CARS</button>
            </div>
            <hr></hr>


            <div>
                {cars.map(car => (
                    <CarCard
                        key={car.id}
                        car={car}
                        removeCar={removeCar}
                        setSelectedCar={setSelectedCar}
                    />
                ))}
            </div>
        </div>
    );
};

export default GaragePage;