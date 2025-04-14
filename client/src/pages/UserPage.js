// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import FavMap from '../components/FavMap';
import DisplayMap from '../components/map';
import Location from '../components/Location';
import Logout from "../util/LogoutCall";
import { useCookies } from 'react-cookie';
import LocationSeparateView from './LocationSeparateView';
import { useState } from 'react';
import { useEffect } from 'react';

export default function UserPage() {
  const [cookies, setCookie] = useCookies(["username"]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    name: cookies.username
  })

  useEffect(() => {

    if (cookies.username === "admin") {
      setIsAdmin(true);
    }
  }, [cookies]);

  return (
    <div className='bg-dark container-fluid h-100 min-vh-100'>
      <nav className="container navbar navbar-expand-lg navbar-dark bg-dark justify-content-center">
        <a className="navbar-brand" >Welcome {user.name}!</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="">Location Table</Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to="map">Map</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="favoriteLocation">Favorite Location</Link>
            </li>
            {
              isAdmin === true ? <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
                : <></>
            }

          </ul>
          <button className="nav-link justify-content-end" onClick={() => {
            Logout().then(res => res)
            .then(data => {
              console.log(data);
              navigate("/");
            });
          }}>Logout</button>
        </div>
      </nav>

      <Routes>
        <Route path='' element={<Location />} />
        <Route path='map' element={<DisplayMap />} />
        <Route path='favoriteLocation' element={<FavMap />} />
        <Route path='/location/:name/:locId' element={<LocationSeparateView />} />
      </Routes>
      {/* <div className='container'>
        <Comments />
      </div> */}

      {/* <div className='container' style={{'height':'35rem'}}>
         <PastHoursChart location={"Hong Kong"} /> 
      </div> */}
    </div>

  )
}
