import React from 'react';
import Routes from './components/Routes';

import { arch, div, h1, winner } from './styles/index.css';


export default function App() {
    return (
        <>
            <h1 className={[arch, h1].join(' ')} >CLEAN TABLET</h1>
            <Routes/>
        </>
    );
}