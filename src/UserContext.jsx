import { createContext, useEffect, useState } from "react";

export  const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const token = sessionStorage.getItem('jwtToken');
  const [username, setUserName] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    if (token) {
      fetch("http://localhost:8000/api/users/me", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
        .then(response => response.json())
        .then(data=>{
          setUserName(data.username);
          setId(data.id);
        })
        .catch(err=>{
          console.log('Error while fetching data',err);
        })
      }
    },[token]);


  return (
    
    <UserContext.Provider value={{ username, setUserName, id, setId}}>
      {children}
    </UserContext.Provider>
  );
}
