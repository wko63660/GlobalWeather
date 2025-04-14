// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import React from "react";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
//import axios from 'axios'
//import { instanceOf } from 'prop-types';
import { Form, Button, Modal } from "react-bootstrap";
import Logout from "../util/LogoutCall";
import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const WeatherAPIKey = "36f420ce320c4e0fa9a154954220305";

export class AdminMainPage extends React.Component {

    constructor(props) {
        super(props);

        // const { Cookies } = props;
        this.state = {
            name: Cookies.get('username'),
            logoutFlag: false
        };

    }

    render() {
        if (this.state.name !== "admin")
            return <Navigate to="/login" />
        if (this.state.logoutFlag)
            return <Navigate to="/login" />
        return <>
            <div className='container'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" >Welcome Admin!</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="locationadmin">Location</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="useradmin">User</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link justify-content-end" onClick={() => {
                                    Logout().then(res => res)
                                    .then(data => {
                                        console.log(data);
                                        this.setState({ logoutFlag: true });
                                    }); 
                                }}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Routes>
                    <Route path='' element={< UpdateData />} />
                    <Route path='locationadmin' element={< LocationAdmin />} />
                    <Route path='useradmin' element={< UserAdmin />} />
                </Routes>
            </div>
        </>;
    }
}

function UpdateData() {
    return <>
        <div>
            Request updated data:
            <AdminDisplayMap />
        </div>
    </>;
}


function LocationAdmin() {
    const [data, getData] = useState([]);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch("http://34.204.136.172/api/location", {
            method: "GET",
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                getData(data);
            })
    }


    return (<>
        <div>
            <h1>Locations</h1>
            <CreateLocationForm callBack={fetchData} />
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">locId</th>
                        <th scope="col">name</th>
                        <th scope="col">lat</th>
                        <th scope="col">long</th>
                        <th scope="col">comments</th>
                        <th scope="col">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ?
                        data.map((item, i) => (
                            <tr key={i}>
                                <td>{item.locId}</td>
                                <td>{item.name}</td>
                                <td>{item.lat}</td>
                                <td>{item.long}</td>
                                <td>
                                    {item.comments.map((comment, j) => (
                                        comment.username + ":" + comment.content + "  "
                                    )).toString()}
                                </td>
                                <td>
                                    <UpdateLocationForm
                                        locId={item.locId}
                                        name={item.name}
                                        lat={item.lat}
                                        long={item.long}
                                        callBack={fetchData}
                                    />
                                    <DeleteLocationForm
                                        locId={item.locId}
                                        name={item.name}
                                        lat={item.lat}
                                        long={item.long}
                                        callBack={fetchData}
                                    />
                                </td>
                            </tr>
                        )) : <span></span>}
                </tbody>
            </table>
        </div>
    </>);
}

function CreateLocationForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const createLocation = async () => {
        console.log("Name", name);
        console.log("lat", lat);
        console.log("long", long);
        let data = JSON.stringify({
            name: name,
            lat: lat,
            long: long,
        });
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        await fetch('http://34.204.136.172/api/location', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };


    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create New Location
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" value={long} onChange={(e) => setLong(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createLocation}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function UpdateLocationForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.name);
    const [lat, setLat] = useState(props.lat);
    const [long, setLong] = useState(props.long);

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const updateLocation = async () => {
        console.log("Name", name);
        console.log("lat", lat);
        console.log("long", long);
        let data = JSON.stringify({
            locId: props.locId,
            name: name,
            lat: lat,
            long: long,
        });
        const requestOptions = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        await fetch('http://34.204.136.172/api/location', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Update
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update locId:{props.locId} Name:{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >locId</Form.Label>
                            <Form.Control type="text" placeholder="locId" defaultValue={props.locId} disabled />
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" value={long} onChange={(e) => setLong(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateLocation}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteLocationForm(props) {
    const [show, setShow] = useState(false);

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const deleteLocation = async () => {
        console.log("locId", props.locId);
        const requestOptions = {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch('http://34.204.136.172/api/location/' + props.locId + '/', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };


    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete locId:{props.locId} Name:{props.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >locId</Form.Label>
                            <Form.Control type="text" placeholder="locId" plaintext readOnly defaultValue={props.locId} />
                            <Form.Label column >Name</Form.Label>
                            <Form.Control type="text" placeholder="Name" plaintext readOnly defaultValue={props.name} />
                            <Form.Label column >Lat</Form.Label>
                            <Form.Control type="text" placeholder="Lat" plaintext readOnly defaultValue={props.lat} />
                            <Form.Label column >Long</Form.Label>
                            <Form.Control type="text" placeholder="Long" plaintext readOnly defaultValue={props.long} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteLocation}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function UserAdmin() {
    const [data, getData] = useState([]);

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = () => {
        fetch("http://34.204.136.172/api/users", {
            credentials: 'include',
            method: "GET",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                console.log(data)
                getData(data);
            })
    }


    return (<>
        <div>
            <h1>Users</h1>
            <CreateUserForm callBack={fetchData} />
            <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">username</th>
                        <th scope="col">password</th>
                        <th scope="col">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? data.map((item, i) => (
                        <tr key={i}>
                            <td>{item.username}</td>
                            <td>{item.password}</td>
                            <td>
                                <UpdateUserForm
                                    username={item.username}
                                    password={item.password}
                                    callBack={fetchData}
                                />
                                <DeleteUserForm
                                    username={item.username}
                                    password={item.password}
                                    callBack={fetchData}
                                />
                            </td>
                        </tr>
                    )) : <span></span>}
                </tbody>
            </table>
        </div>
    </>);
}

function CreateUserForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const createUser = async () => {
        console.log("Name", name);
        console.log("Password", password);
        let data = JSON.stringify({
            newname: name,
            newpw: password,
        });
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        await fetch('http://34.204.136.172/api/users', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create New User
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createUser}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


function UpdateUserForm(props) {
    const [show, setShow] = useState(false);
    const [name, setName] = useState(props.username);
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); //for reload page after operation

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const updateUser = async () => {
        console.log("New Name", name);
        console.log("New Password", password);
        let data = JSON.stringify({
            newname: name,
            newpw: password,
        });
        const requestOptions = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        };
        await fetch('http://34.204.136.172/api/users/' + props.username, requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Update
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="New Username" value={name} onChange={(e) => setName(e.target.value)} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={updateUser}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteUserForm(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate(); //for reload page after operation

    const deleteUser = async () => {
        console.log("username", props.username);
        const requestOptions = {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        };
        await fetch('http://34.204.136.172/api/users/' + props.username + '/', requestOptions)
            .then(res => res.text())
            .then(data => {
                window.alert(data);
                props.callBack();
            })
        setShow(false);
        // navigate(0);
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Username:{props.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="ControlTextarea1" >
                            <Form.Label column >Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" plaintext readOnly defaultValue={props.username} />
                            <Form.Label column >Password</Form.Label>
                            <Form.Control type="text" placeholder="Password" plaintext readOnly defaultValue={props.password} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteUser}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}


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

function AdminDisplayMap(props) {

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
    const [rerender, setRerender] = useState(false);

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
            }
            )).then((res) => res.json()).then(data => {

                // console.log(data)
                setMarked({
                    markerText: data.current.condition.text,
                    markerTempC: data.current.temp_c,
                    currentTime: data.location.localtime,
                    markerName: data.location.name
                })

            }
            ).catch(console.error());
            // const json = await res.json();

            // setMarked({
            //     markerText: json.current.condition.text,
            //     markerTempC: json.current.temp_c,
            //     currentTime: json.location.localtime,
            //     markerName: json.location.name
            // })

            // json.forEach(element => {
            //     console.log(element.name)
            // })
        }
        fetchLocDetails();
    })

    const refreshClick = React.useCallback((props) => {
        async function fetchLocDetails() {
            const res = await fetch("http://api.weatherapi.com/v1/current.json?" + new URLSearchParams({
                key: WeatherAPIKey,
                q: props
            }), {
                headers: {
                    'Cache-Control': 'no-cache'
                }
            }).catch(console.error());

            const json = await res.json();

            setMarked({
                markerText: json.current.condition.text,
                markerTempC: json.current.temp_c,
                currentTime: json.location.localtime,
                markerName: json.location.name
            })
            // setRerender(!rerender);
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
                                //fetch marker details in to infoWindow
                                refreshClick(marked.markerName)
                            }}>Refresh</button>
                        </span>
                        <span>
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                if (!favorite.includes(selected)) {
                                    setFavorite(current => [...current, selected]);
                                }
                                addFavLoc()
                            }}>Mark favorite </button>
                        </span>
                        <span>
                            <Link to={{ pathname: `/user/location/${selected.name}/${selected.locId}`, }} className="link-dark">
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