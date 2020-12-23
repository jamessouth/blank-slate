import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './styles/index.css';
// import { arch, div, h1, winner } from './styles/index.css';

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(
    <>
        <h1 className="text-6xl mt-11 text-center font-arch decay-mask">CLEAN TABLET</h1>
        <App/>
    </>,
document.querySelector('#root'));
