import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import './styles/index.css';
import { arch, div, h1, winner } from './styles/index.css';

ReactDOM.render(
    <>
        <h1 className={[arch, h1].join(' ')} >CLEAN TABLET</h1>
        <App/>
    </>,
document.querySelector('#root'));
