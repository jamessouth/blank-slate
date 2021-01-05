import React, { useEffect } from "react";
import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifySignOut,
    AmplifyAuthFields,
    AmplifySignUp,
} from '@aws-amplify/ui-react';
import { useHistory } from "react-router-dom";

export default function Lobby() {
    const history = useHistory();

    useEffect(() => {
        const ws = new WebSocket(process.env.CT_WS);
        console.log("pojoihuh", Date.now());

        ws.addEventListener('open', function (e) {
            console.log(e, Date.now());
          }, false);

        ws.addEventListener('error', function (e) {
            console.log(e, Date.now());
        }, false);
        
        ws.addEventListener('close', function (e) {
              console.log(e, Date.now());
              
            }, false);
            
            return function cleanup() {
              console.log('cleanup');
            ws.close(1000);
          };
    }, []);

    return (
        <>
            <div slot="sign-out">
                <AmplifySignOut
                    buttonText="&#128682;"
                    // handleAuthStateChange={
                    //     (nextAuthState, authData) => {
                    //         history.push("/");
                    //         console.log("authhh", nextAuthState, authData)
                    //     }
                    // }
                />
            </div>

            <div className="flex flex-col mt-8">
                <button className="mx-auto mb-8 h-40 w-1/2 bg-smoke-100 text-gray-700">
                    start a new game
                </button>

                <button className="mx-auto mb-8 h-40 w-1/2 bg-gray-100 text-gray-700">
                    join
                </button>
                <button className="mx-auto mb-8 h-40 w-1/2 bg-gray-100 text-gray-700">
                    join
                </button>
                <button className="mx-auto mb-8 h-40 w-1/2 bg-gray-100 text-gray-700">
                    join
                </button>
            </div>
        </>
    );
}
