import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import GaragePage from './pages/GaragePage';
import WinnersPage from './pages/WinnersPage';
import "./styles/App.css";

const App: React.FC = () => {
    return (
        <div className="App">
            <BrowserRouter>
                <nav>
                    <div>
                        <Link className="link" to="/">TO GARAGE</Link>
                        <Link className="link" to="/WinnersPage">TO WINNERS</Link>
                    </div>

                </nav>
                <Routes>
                    <Route path="/" element={<GaragePage />} />
                    <Route path="/WinnersPage" element={<WinnersPage />} />
                </Routes>
            </BrowserRouter>
        </div>

    );
};

export {App};