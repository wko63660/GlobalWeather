// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

import { Form, Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

const WeatherAPIKey = "36f420ce320c4e0fa9a154954220305";

const libraries = ["places"];
const mapContainerStyle = {
    width: '1000px',
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




export default function FavMap(props) {
    const { isLoaded, loadError } = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        googleMapsApiKey: "AIzaSyAacwmaKGAVh7jdyCtSovdyaz3bWOZa1yw",
        libraries,
    });

    const [data, setData] = useState([]);
    const [dataStore, setDataStore] = useState(data);
    const [latAsc, setLatAsc] = useState(true);
    const [longAsc, setLongAsc] = useState(true);
    const [nameAsc, setNameAsc] = useState(true);
    const [cookies, setCookie] = useCookies(["username"]);
    const [markers, setMarkers] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [marked, setMarked] = React.useState({
        markerText: "",
        markerTempC: "",
        currentTime: "",
        markerName: ""
    });

    //fetch all location in to map
    React.useEffect(function fetchingDate() {
        async function fetchLoction() {
            const res = await fetch("http://34.204.136.172/api/favloc/", {
                credentials: 'include'
            }).catch(console.error());
            const json = await res.json();
            let tmpMarkers = []
            json.forEach(element => {
                // console.log(element.name)
                tmpMarkers.push({
                    name: element.name,
                    lat: element.lat,
                    lng: element.long,
                    locId: element.locId
                });
            });
            console.log(tmpMarkers)
            setMarkers(tmpMarkers);

        }
        fetchLoction();
        fetchData();
    }, []);

    const fetchData = () => {
        fetch("http://34.204.136.172/api/favloc", {
            method: "GET",
            credentials: "include",
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
        if (latAsc) {
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
        if (nameAsc) {
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
        if (longAsc) {
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


    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);


    if (loadError) return "Error loading map";
    if (!isLoaded) return "Loading Map";

    const rmFav = () => {

    }

    return (
        <div>
            <div class="d-flex justify-content-between mt-3">
                <table class="table table-hover table-dark mx-5">
                    <caption>List of Favourite Location</caption>
                    <thead className="text-light">
                        <tr>
                            <th scope="col" onClick={() => sortByName()}>Name</th>
                        </tr>
                    </thead>
                    <tbody className="text-light">
                        {data.map((item, i) => (
                            <tr key={i}>
                                <td style={{height : 10}}>
                                    <Link to={{ pathname: `/user/location/${item.name}/${item.locId}`, }} className="link-light">
                                        {item.name}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mx-5">
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
                        {selected ? (<InfoWindow
                            position={{ lat: selected.lat, lng: selected.lng }}
                            onCloseClick={() => {
                                setSelected(null);
                            }}>

                            <div>
                                <h2 style={{ fontSize: "medium" }}>{marked.markerName}, {marked.markerText}</h2>
                                <p>The temperature is now {marked.markerTempC}°C</p>
                                <p>The time is now {marked.currentTime}</p>
                                <Link to={{ pathname: `/user/location/${selected.name}/${selected.locId}`, }} className="nav-link">
                                    Read more ...
                                </Link>
                                <span>
                                    <AddCommentForm
                                        user={cookies.username}
                                        locationId={selected.locId}
                                        locationName={marked.markerName}
                                        locationText={marked.markerText} />
                                </span>
                                {/* <span>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            setFavorite (current => [...current, selected]);
                        }}>Mark favorite</button>
                    </span> */}

                            </div>
                        </InfoWindow>)
                            : null}

                    </GoogleMap>
                </div>
            </div>
        </div>);
}


function AddCommentForm(props) {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState('');

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