import React, { useState, useEffect } from 'react';
import { Car, Winner } from '../types';
import CarCard from "../CarCard";

const GaragePage: React.FC = () => {
    //current page
    const [page, setPage] = useState<number>(1)

    //AI generated db (for test generation)
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

    const unitsPerPage = 7;
    let lastCarIndex = unitsPerPage * page;
    let firstCarIndex = lastCarIndex - unitsPerPage;

    const [cars, setCars] = useState<Car[]>([]);
    const [newCarName, setNewCarName] = useState<string>("");
    const [selectedCar, setSelectedCar] = useState<Car | null>();
    const [newColor, setNewColor] = useState<string>("#FFFFFF");
    const [winner, setWinner] = useState<[number, number]>([0, 0]);


    //1 || count
    let totalPages = Math.max(1 , Math.ceil(cars.length / unitsPerPage)) ;

    useEffect(() => {
        fetchCars();
        lastCarIndex = unitsPerPage * page;
        firstCarIndex = lastCarIndex - unitsPerPage;
        totalPages = Math.ceil(cars.length / unitsPerPage);
    }, [cars, page]);

    // Function to fetch cars from the backend (runs on port 3000)
    const fetchCars = async () => {
        try {
            const response = await fetch('http://localhost:3000/garage');
            if (!response.ok) {
                throw new Error('Bad response');
            }
            const data = await response.json();
            setCars(data);
            if(page > totalPages){
                prevPage();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    //CRUD operations on the cars

    //Function to add a new car to the garage
    const createCar = async () => {
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
                console.log(`Created a car {name: ${newCarName}, color: ${newColor}}`)
            }else{
                throw new Error('Empty name or more than 16 characters');
            }
        } catch (error) {
            console.error('Error creating car:', error);
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

                deleteWinner(id);

                fetchCars();
            }
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    //Function to change selected car with current inputs
    const updateCar = async () =>{
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
                    console.log(`Updated car with {id: ${selectedCar.id} name: ${newCarName} color: ${newColor}`)
                }else{
                    throw new Error('Empty name or more than 16 characters');
                }
            }else{
                throw new Error('No car selected ');
            }

        } catch (error) {
            console.error('Error updating car:', error);
        }
    }


    //CRUD on Winners

    //Function to update a new winner
    const updateWinner = async () => {
        const [id, newTime] = winner;
        try {
            if (id > 0) {
                const existingWinner: Winner | {} = await getWinner(id);
                if (existingWinner && 'id' in existingWinner) {
                    // If winner exists, update their record
                    const response = await fetch(`http://localhost:3000/winners/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ wins: existingWinner.wins + 1, time: Math.min(newTime, existingWinner.time) }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update winner');
                    }
                    console.log(`Updated a winner -> id: ${id}, wins: ${existingWinner.wins + 1}, time: ${Math.min(newTime, existingWinner.time)}`);
                } else {
                    // If winner does not exist, create a new one
                    createWinner();
                }
            } else {
                throw new Error('Invalid ID');
            }
        } catch (error) {
            console.error('Error updating winner:', error);
        }
    };

    //Function to create a new winner
    const createWinner = async () => {
        try {
            const [id, time] = winner;
            if (id > 0 && time > 0) {
                const response = await fetch('http://localhost:3000/winners', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, wins: 1, time }),
                });

                if (!response.ok) {
                    throw new Error('Failed to create winner');
                }
                console.log(`Added a winner -> id: ${id}, wins: 1, time: ${time}`);
            } else {
                throw new Error('Invalid id or time');
            }
        } catch (error) {
            console.error('Error adding winner:', error);
        }
    };

    //Function to get a winner from ID : number
    const getWinner = async (id: number): Promise<Winner | {}> => {
        try {
            const response = await fetch(`http://localhost:3000/winners/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch winner');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting winner:', error);
            return {};
        }
    };

    //Function to delete a winner by ID : number
    const deleteWinner = async (id: number)=> {
        const response = await fetch(`http://localhost:3000/winners/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error(`Failed to find car with id ${id}`);
        }
    };





    //Tools for randomization

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
        for (let i = 0; i < 10; i++) {
            //todo: change to 100 defore deployment
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

    //Function to race all cars
    const raceAll = () =>{
        //todo: make every car race (dont forget about the engine fail)
    }


    //Pagination controls
    const nextPage = () => setPage( page == totalPages? page : page+1);
    const prevPage = () => setPage(page==1? 1 : page-1);
    const firstPage = () => setPage(1);
    const lastPage = () => setPage(totalPages);

    return (
        <div>
            <hr></hr>
            <h1>Your garage has {cars.length} cars</h1>
            <div className="controls">
                <div>
                    <button onClick={raceAll}>RACE</button>
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

                    <button onClick={updateCar}>UPDATE</button>
                    <button onClick={createCar}>CREATE</button>
                </div>

                <button onClick={generateCars}>GENERATE CARS</button>
            </div>
            <hr></hr>

            <div className="pagination">
                <button onClick={firstPage}>First</button>
                <button onClick={prevPage}>Previous</button>
                <span style={ {margin: "3vw"}}>Page {page} of {totalPages}</span>
                <button onClick={nextPage}>Next</button>
                <button onClick={lastPage}>Last</button>
            </div>

            <hr/>

            <div>
                {cars.slice(firstCarIndex, lastCarIndex).map(car => (
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