import React, { useEffect, useState } from 'react';
import { winnerInfo } from '../types';
import "../styles/WinnersPage.css";
import { FaCarSide } from "react-icons/fa6";

const WinnersPage: React.FC = () => {
    const [winnerInfo, setWinnerInfo] = useState<winnerInfo[]>([]);
    const [page, setPage] = useState<number>(1);
    const [sortBy, setSortBy] = useState<string>("wins"); // Default sorting by wins
    const [sortOrder, setSortOrder] = useState<string>("asc"); // Default sorting order
    const unitsPerPage = 10;
    let lastCarIndex = unitsPerPage * page;
    let firstCarIndex = lastCarIndex - unitsPerPage;

    //1 || count
    let totalPages = Math.max(1, Math.ceil(winnerInfo.length / unitsPerPage));

    useEffect(() => {
        fetchWinners();
    }, []);

    useEffect(() => {
        sortWinners();
    }, [sortBy, sortOrder]);

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
    const getCar = async (id: number) => {
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

    //Function to sort winners based on the selected criteria and order
    const sortWinners = () => {
        const sortedWinners = [...winnerInfo].sort((a, b) => {
            const aValue = sortBy === "wins" ? a.wins : a.time;
            const bValue = sortBy === "wins" ? b.wins : b.time;
            if (sortOrder === "asc") {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
        setWinnerInfo(sortedWinners);
    };

    // Function to handle sorting
    const handleSort = (sortBy: string) => {
        if (sortBy === sortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(sortBy);
            setSortOrder("asc");
        }
    };

    //Pagination controls
    const nextPage = () => setPage(page === totalPages ? page : page + 1);
    const prevPage = () => setPage(page === 1 ? 1 : page - 1);
    const firstPage = () => setPage(1);
    const lastPage = () => setPage(totalPages);

    return (
        <div>
            <hr />
            <h1>You have {winnerInfo.length} winners!</h1>

            <div className="pagination">
                <button onClick={firstPage}>First</button>
                <button onClick={prevPage}>Previous</button>
                <span style={{ margin: "3vw" }}>Page {page} of {totalPages}</span>
                <button onClick={nextPage}>Next</button>
                <button onClick={lastPage}>Last</button>
            </div>


            <div className="sorting-buttons">
                <button onClick={() => handleSort("wins")}>Sort by Wins</button>
                <button onClick={() => handleSort("time")}>Sort by Time</button>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "Descending" : "Ascending"}</button>
            </div>

            <hr />

            <div className="info">
                <p>№</p>
                <p>CAR</p>
                <p>NAME</p>
                <p>WINS</p>
                <p>BEST TIME (s)</p>
            </div>
            <hr />

            {winnerInfo.slice(firstCarIndex, lastCarIndex).map((winner) => (
                //This is to check that we have all info, and only then display on screen
                winner.name &&
                <div className="info" key={winner.id}>
                    <p>{winner.id}</p>
                    <FaCarSide className="car" style={{ width: '100px', height: '70px', color: winner.color }} />
                    <p>{winner.name}</p>
                    <p>{winner.wins}</p>
                    <p>{winner.time}</p>
                </div>
            ))}
        </div>
    );
};

export default WinnersPage;
