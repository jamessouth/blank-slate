import React, {
    //useContext,
    //createContext,
    useState
  } from "react";
  import //BrowserRouter as Router,
  //Switch,
  //Route,
  //Link,
  //Redirect,
  //useHistory
  //useLocation
  "react-router-dom";
  import { authContext } from "./App";
  
//   const fakeAuth = {
//     isAuthenticated: false,
//     signin(cb) {
//       fakeAuth.isAuthenticated = true;
//       setTimeout(cb, 100); // fake async
//     },
//     signout(cb) {
//       fakeAuth.isAuthenticated = false;
//       setTimeout(cb, 100);
//     }
//   };
  
  export default function ProvideAuth({ children }) {
    // const [authState, setAuthState] = useState();
    
    
    // useEffect(() => {
    //     onAuthUIStateChange((nextAuthState, authData) => {
    //         setAuthState(nextAuthState);
    //         setUser(authData);
    //     });
    // }, []);

    

    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
  
  function useProvideAuth() {
      const [user, setUser] = useState();
      const [authState, setAuthState] = useState();
      
      // console.log('provide: ', user, authState);
      // const signin = (cb) => {
          //   return fakeAuth.signin(() => {
    //     setUser("user");
    //     cb();
    //   });
    // };
  
    // const signout = (cb) => {
    //   return fakeAuth.signout(() => {
    //     setUser(null);
    //     cb();
    //   });
    // };
  
    return {
      authState,
      setAuthState,
      user,
      setUser
    };
  }
  