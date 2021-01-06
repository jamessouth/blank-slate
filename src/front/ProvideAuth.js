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
  
  const fakeAuth = {
    isAuthenticated: false,
    signin(cb) {
      fakeAuth.isAuthenticated = true;
      setTimeout(cb, 100); // fake async
    },
    signout(cb) {
      fakeAuth.isAuthenticated = false;
      setTimeout(cb, 100);
    }
  };
  
  export default function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }
  
  function useProvideAuth() {
    const [user, setUser] = useState(null);
  
    const signin = (cb) => {
      return fakeAuth.signin(() => {
        setUser("user");
        cb();
      });
    };
  
    const signout = (cb) => {
      return fakeAuth.signout(() => {
        setUser(null);
        cb();
      });
    };
  
    return {
      user,
      signin,
      signout
    };
  }
  