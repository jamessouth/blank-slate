import React from 'react';
import { name } from '../styles/Name.module.css';

export default function Name({ playerName }) {

    return (
        <>
            {
                playerName &&
                    <p className={ name }>
                        { playerName }
                    </p>
            }
        </>
    );

}