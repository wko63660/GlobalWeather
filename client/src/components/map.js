// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { useCookies } from 'react-cookie';

const WeatherAPIKey = "36f420ce320c4e0fa9a154954220305";
const libraries = ["places"];
const mapContainerStyle = {
    width: '1115px',
    height: '800px',
};
const center = {
    lat: 49.117029,
    lng: 14.569695,
}

const options = {
    disableDefaultUI: true,
    zoomControl: true
}

export default function DisplayMap(props) {

    const [favorite, setFavorite] = React.useState([]);
    const [cookies, setCookie] = useCookies(["username"]);
    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [marked, setMarked] = React.useState({
        markerText: "",
        markerTempC: "",
        currentTime: "",
        markerName: ""
    });

    const { isLoaded, loadError } = useLoadScript({
            // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            googleMapsApiKey: "AIzaSyAacwmaKGAVh7jdyCtSovdyaz3bWOZa1yw",
            libraries,
        });

    //fetch all location in to map
    React.useEffect(function fetchingDate() {
        async function fetchLoction() {
            const res = await fetch("http://34.204.136.172/api/location").catch(console.error());
            const json = await res.json();
            let tmpMarkers = []
            json.forEach(element => {
                // console.log(element.name)
                tmpMarkers.push({
                    name: element.name,
                    id: element.locId,
                    lat: element.lat,
                    lng: element.long,
                    locId: element.locId
                });
            });
            console.log(tmpMarkers)
            setMarkers(tmpMarkers);

        }
        if (props.mode !== "favorite") {
            fetchLoction();
        }



    }, []);

    //fetch marker current details
    const markerClick = React.useCallback((mark) => {
        async function fetchLocDetails() {
            const res = await fetch("http://api.weatherapi.com/v1/current.json?" + new URLSearchParams({
                key: WeatherAPIKey,
                q: mark.name
            })).catch(console.error());
            const json = await res.json();

            setMarked({
                markerText: json.current.condition.text,
                markerTempC: json.current.temp_c,
                currentTime: json.location.localtime,
                markerName: json.location.name
            })

            // json.forEach(element => {
            //     console.log(element.name)
            // })
        }
        fetchLocDetails();
    })

    const addFavLoc = () => {
        var data = selected;
        console.log(data);
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch("http://34.204.136.172/api/favloc/" + selected.id, requestOptions)
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
                
            }
            )
            .catch((e)=>{
                console.error();
                window.alert("Add Failed");
            });
    }

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);


    if (loadError) return "Error loading map";
    if (!isLoaded) return "Loading Map";

    

    return (<div className=" d-flex justify-content-center ">
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={2.1}
            center={center}
            options={options}
            // onClick={onMapClick}
            onLoad={onMapLoad}
        >
            {/* mark a favorite point on the map */}
            {markers.map(marker =>
                <Marker key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}

                    animation={window.google.maps.Animation.DROP}
                    onClick={() => {

                        setSelected(marker);
                        //fetch marker details in to infoWindow
                        markerClick(marker);

                    }} />
            )}

            {/* Click marker to show pop up window */}
            {selected ? 
                (<InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => {
                        setSelected(null);
                }}>

                    <div>
                        <h2 style={{ fontSize: "medium" }}>{marked.markerName}, {marked.markerText}</h2>
                        <p>The temperature is now {marked.markerTempC}°C</p>
                        <p>The time is now {marked.currentTime}</p>
                        <span>
                            <AddCommentForm
                                user={cookies.username}
                                locationId={selected.id}
                                locationName={marked.markerName}
                                locationText={marked.markerText} />
                        </span>
                        <span>
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                if(!favorite.includes(selected)){
                                    setFavorite (current => [...current, selected]);
                                }
                                addFavLoc()
                            }}>Mark favorite </button>
                        </span>
                        <span>
                            <Link to={{pathname: `/user/location/${selected.name}/${selected.locId}`,}} className="link-dark">
                                <button type="button" className="btn btn-secondary" >Details</button>
                            </Link>
                        </span>

                    </div>
                </InfoWindow>)
                : null}

        </GoogleMap>

    </div>);
}

function AddCommentForm(props) {
    const [value, setValue] = useState('');
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = () => {
        console.log(props.locationId);
        console.log(value);
        if (!props.user || value.length == 0) {
            window.alert("Empty Comment");
            return;
        }

        let data = JSON.stringify({
            username: props.user,
            content: value
        });

        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data
        };
        console.log(data)

        fetch("http://34.204.136.172/api/comment/" + props.locationId, requestOptions)
            .then((res) => {
                console.log(res.json())
            })
            .then( () => {
                setShow(false);
                window.alert("Comment Added");
            })
            .catch(console.error());
        setValue('')
    }


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Comment
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.locationName}, {props.locationText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="ControlTextarea1"
                        >
                            <Form.Label>Comment</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                value={value}
                                onChange={e => {
                                setValue(e.target.value);
                                }} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Add Comment
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}