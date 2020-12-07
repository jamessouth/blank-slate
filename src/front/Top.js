import React from 'react';
import App from './App';
import { arch, div, h1, winner } from './styles/index.css';

export default function Top() {

    return (
      <>
            <h1 className={[arch, h1].join(' ')} >CLEAN TABLET</h1>
            <App/>
      </>
    );
  
}