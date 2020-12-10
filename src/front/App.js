import React from 'react';
import Routes from './components/Routes';

import { arch, div, h1, winner } from './styles/index.css';
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <h1 className={[arch, h1].join(' ')} >CLEAN TABLET</h1>
            <Routes/>
        </Router>
    );
}