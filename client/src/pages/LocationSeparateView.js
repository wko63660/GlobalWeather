// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import React from 'react'
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import PastHoursChart from "../components/Past10HoursWeather"
import HistorialChart from '../components/HistorialChart';
import { useCookies } from 'react-cookie';

const WeatherAPIKey = "36f420ce320c4e0fa9a154954220305";
const libraries = ["places"];

const LocationSeparateView = (props) => {
    const { name, locId } = useParams();
    const [data, setData] = useState({});
    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState({});
    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const mapRef = useRef();
    const [cookies, setCookie] = useCookies(["username"]);
    const [isAdmin, setIsAdmin] = useState([]);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyAacwmaKGAVh7jdyCtSovdyaz3bWOZa1yw",
        libraries,
    });
    const mapContainerStyle = {
        width: '500px',
        height: '500px',
    };

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const addFavLoc = () => {
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch("http://34.204.136.172/api/favloc/" + locId, requestOptions)
            .then((res) => {
                if(!res.ok){
                    console.error();
                    window.alert("Add Failed");
                }
                else{
                    // console.log(res)
                    res.json();
                    window.alert("Added to Fav");
                }
            })
            .catch((e)=>{
                console.error();
                window.alert("Add Failed");
            });
    }

    const addComment = () => {
        //POST /comment/:locId (body: username, content)
        if (!cookies.username || newComment.length == 0) {
            window.alert("Empty");
            return;
        }

        let data = JSON.stringify({
            username: cookies.username,
            content: newComment
        });

        console.log(data)
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data
        };

        fetch("http://34.204.136.172/api/comment/" + locId, requestOptions)
            .then((res) => {
                console.log(res.json())
                const commentEl = document.querySelector("#new-comment");
                commentEl.value ="";
                fetchComment();
            })
            .catch(console.error());
    }

    const fetchComment = () => {
        fetch("http://34.204.136.172/api/comment/" + locId, {
            method: "GET",
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                let tmp = [];
                data.map((item, i) => {
                    tmp.push(
                        <div className="text-left flex-grow-1 text-start" key={i}>
                            <h5>{item.username}</h5>
                            <p>{item.content}</p>
                            <hr
                                style={{
                                    color: 'white',
                                    backgroundColor: 'white',
                                    height: 2
                                }}
                            />
                        </div>
                    );
                })
                setComment(tmp);
                // 
            })
    }

    const fetchLocation = () => {
        console.log("HI")
        fetch("http://api.weatherapi.com/v1/current.json?" + new URLSearchParams({
            key: WeatherAPIKey,
            q: name
        }), {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then(res => res.json())
            .then(data => {
                setData({
                    name: data.location.name,
                    time: data.location.localtime,
                    condition: data.current.condition.text,
                    temperature: data.current.temp_c,
                    wind_kph: data.current.wind_kph,
                    wind_dir: data.current.wind_dir,
                    humidity: data.current.humidity,
                    precip_mm: data.current.precip_mm,
                    vis_km: data.current.vis_km,
                });
                setMarkers([{
                    name: data.location.name,
                    id: data.location.locId,
                    lat: data.location.lat,
                    lng: data.location.lon,
                }]);
                setCenter({
                    lat: data.location.lat,
                    lng: data.location.lon,
                });
            })
    }

    useEffect(() => {
        fetchLocation();
        fetchComment();

        if (cookies.username == "admin") {
            setIsAdmin(true);
        }

    }, []);

    if (!isLoaded) return "Loading Map";
    if (loadError) return "Error loading map";

    return <div className='bg-dark container'>
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-row justify-content-around">
                    <div className="d-inline-flex flex-column text-start">
                        <h2 className="pb-5 ">
                            {data.name}
                            <br />
                            {data.time}
                        </h2>
                        <div className='lead'>
                            {data.temperature}°C
                        </div>
                        <div className='lead'>
                            {data.condition}
                        </div>
                        <div className='lead'>
                            Wind: {data.wind_kph} ({data.wind_dir})
                        </div>
                        <div className='lead'>
                            Humidity: {data.humidity}%
                        </div>
                        <div className='lead'>
                            Precipitation : {data.precip_mm}mm
                        </div>
                        <div className='lead'>
                            Visibility: {data.vis_km}km
                        </div>
                        {
                            isAdmin === true ?
                                <button type="button" className="btn btn-primary mt-5" onClick={() => { fetchLocation() }}>Refresh</button>
                                : <></>
                        }
                        <button type="button" className="btn btn-primary mt-5" onClick={() => { addFavLoc() }}>Add to Favaourite</button>
                    </div>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={5}
                        center={center}
                        onLoad={onMapLoad}
                    >
                        {/* mark a favorite point on the map */}
                        {markers.map(marker =>
                            <Marker key={`${marker.lat}-${marker.lng}`}
                                position={{ lat: marker.lat, lng: marker.lng }}

                                animation={window.google.maps.Animation.DROP}
                                onClick={() => {

                                }} />
                        )}

                    </GoogleMap>
                </div>
            </div>
        </div>
        <div className='bg-light mt-5'>
            <h2>Weather in the past 5 days:</h2>
            <HistorialChart location={name} />
        </div>
        <div className='bg-light mt-5'>
            <h2>Weather in the last 10 hours:</h2>
            <PastHoursChart location={name} />
        </div>
        <div className='text-light mt-3'>
            <h3>Comments</h3>

            <div id="comments">
                <div id="c1001" className="d-flex justify-content-start flex-column">
                    {comment}
                </div>
            </div>
            <h6>Add your comment:</h6>
            <form>
                <div className="mb-3">
                    <label htmlFor="new-comment" className="form-label">Comment</label>
                    <textarea className="form-control" id="new-comment" rows="3" onChange={(e) => setNewComment(e.target.value)}></textarea>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => { addComment() }}>Add comment</button>
            </form>

        </div>
    </div >
}

export default LocationSeparateView;