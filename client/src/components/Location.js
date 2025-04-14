// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { Link } from "react-router-dom";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>


function LocationUser() {
    const [data, setData] = useState([]);
    const [cookies, setCookie] = useCookies(['username']);
    const [dataStore, setDataStore] = useState(data);
    const [latAsc, setLatAsc] = useState(true);
    const [longAsc, setLongAsc] = useState(true);
    const [nameAsc, setNameAsc] = useState(true);

    // console.log(cookies.username)
    // console.log(document.cookie);
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch("http://34.204.136.172/api/location", {
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setData(data);
                setDataStore(data);
            })
    }

    const sortByLat = (a, b) => {
        let tmp = [...data];
        if(latAsc){
            tmp.sort((a, b) => {
                if (a.lat < b.lat) {
                    return -1;
                }
                if (a.lat > b.lat) {
                    return 1;
                }
                return 0;
            })
            setLatAsc(false);
        }
        else {
            tmp.sort((a, b) => {
                if (a.lat < b.lat) {
                    return 1;
                }
                if (a.lat > b.lat) {
                    return -1;
                }
                return 0;
            })
            setLatAsc(true);
        }
        setData(tmp);

    }
    const sortByName = (a, b) => {
        let tmp = [...data];
        if(nameAsc){
            tmp.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            })
            setNameAsc(false);
        }
        else {
            tmp.sort((a, b) => {
                if (a.name < b.name) {
                    return 1;
                }
                if (a.name > b.name) {
                    return -1;
                }
                return 0;
            })
            setNameAsc(true);
        }
        setData(tmp);

    }
    const sortByLong = (a, b) => {
        let tmp = [...data];
        if(longAsc){
            tmp.sort((a, b) => {
                if (a.long < b.long) {
                    return -1;
                }
                if (a.long > b.long) {
                    return 1;
                }
                return 0;
            })
            setLongAsc(false);
        }
        else {
            tmp.sort((a, b) => {
                if (a.long < b.long) {
                    return 1;
                }
                if (a.long > b.long) {
                    return -1;
                }
                return 0;
            })
            setLongAsc(true);
        }
        setData(tmp);
    }
    const onClickSearch=()=>{
        // event.preventDefault();
        let tmp =[];
        let tolerance = 1;

        const searchKey = document.querySelector("#search-bar").value;
        if(searchKey==""){
            setData(dataStore);
            console.log(dataStore);
        }
        else if(!isNaN(parseFloat(searchKey))){
            console.log(parseFloat(searchKey));
            tmp = dataStore.filter(obj => {
                if(Math.abs(obj.lat-parseFloat(searchKey))<tolerance || Math.abs(obj.long-parseFloat(searchKey))<tolerance)
                    return true;
                else return false;
            })
            console.log(35.652832 - parseFloat(searchKey));
            setData(tmp);
        }
        else {
            console.log(searchKey);
            let tmp = [];
            tmp = dataStore.filter(obj => obj.name.includes(searchKey))
            setData(tmp);
        }
        // else if(s)
        // console.log(parseFloat(searchKey)-35.652832);
    }

    return (<>
        <div className="container">
            <h1 className="text-light">Locations</h1>
            <form className="searchform" action="">
                <input type="text" placeholder="Location..." name="search" id="search-bar" />
                <button className="btn btn-success" onClick={(event)=>{event.preventDefault(); onClickSearch();}}>Search</button>
            </form>
            <br />
            <table className="table table-bordered">
                <thead className="text-light">
                    <tr>
                        <th scope="col" onClick={() => sortByName()}>Name</th>
                        <th scope="col" onClick={() => sortByLat()}>Lat</th>
                        <th scope="col" onClick={() => sortByLong()}>Long</th>
                    </tr>
                </thead>
                <tbody className="text-light">
                    {data.map((item, i) => (
                        <tr key={i}>
                            <td>
                                <Link to={{pathname: `/user/location/${item.name}/${item.locId}`,}} className="link-light">
                                    {item.name}
                                </Link>
                            </td>
                            <td>{item.lat}</td>
                            <td>{item.long}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>);
}

export default LocationUser;