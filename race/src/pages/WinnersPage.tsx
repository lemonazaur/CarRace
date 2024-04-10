import React, {useEffect, useState} from 'react';
import { Car } from '../types';
import "../styles/WinnersPage.css"
import { FaCarSide } from "react-icons/fa6";

type winnerInfo = {
    id: number;
    wins: number;
    time: number;
    name: string;
    color: string;
};

const WinnersPage: React.FC = () => {
    const [winnerInfo, setWinnerInfo] = useState<winnerInfo[]>([]);
    const [page, setPage] = useState(1)
    const unitsPerPage = 7;
    const lastCarIndex = unitsPerPage * page;
    const firstCarIndex = lastCarIndex - unitsPerPage;

    useEffect(() => {
        fetchWinners();
    }, []);

    //Function to fetch winners
    const fetchWinners = async () => {
        try {
            const response = await fetch('http://localhost:3000/winners');
            if (!response.ok) {
                throw new Error('Bad response');
            }
            const data = await response.json();
            combineInfo(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    //Function to combine winner and car types into one
    const combineInfo = async (winners: any[]) => {
        const promises = winners.map(async (winner) => {
            const carInfo = await getCar(winner.id);
            // Combine the winner info with car info
            return { ...winner, ...carInfo };
        });
        const winnersWithCars = await Promise.all(promises);
        setWinnerInfo(winnersWithCars);
    };

    //Function to get an individual winner's car info
    const getCar = async (id: number) =>{
        try {
            const response = await fetch(`http://localhost:3000/garage/${id}`);
            if (!response.ok) {
                throw new Error('Bad response');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching car:', error);
        }
    }


    return (
        <div>
            <hr/>
            <h1>Winners</h1>
            <hr/>
            <div className="info">
                <p>№</p>
                <p>CAR</p>
                <p>NAME</p>
                <p>WINS</p>
                <p>BEST TIME (s)</p>
            </div>
            <hr/>
            {winnerInfo.map((winner) => (
                <div className="info" key={winner.id}>
                    <p>{winner.id}</p>
                    <FaCarSide className="car" style={{ width: '100px', height: '70px', color: winner.color}} />
                    <p>{winner.name}</p>
                    <p>{winner.wins}</p>
                    <p>{winner.time}</p>
                </div>
            ))}
        </div>
    );
};

export default WinnersPage;