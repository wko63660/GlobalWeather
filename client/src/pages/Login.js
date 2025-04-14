// 1. Chan Lok Hei, Paul (1155126753) 
// 2. Kung Man Kei (1155125421) 
// 3. Chow Him Chak (1155125328) ESTR2106 
// 4. Ko Wang Steven (1155125791) 
// 5. Li Chun Lam (1155116313) 
// 6. Li Pui Lam Precila (1155133629) 

import 'bootstrap/dist/css/bootstrap.min.css'
import { Component, useEffect, useState } from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';
import UserPage from './UserPage';
import { AdminMainPage } from './admin';
import Cookies from 'js-cookie';
const Login = () => {
    const [isWrong, setWrong] = useState(false);
    const navigate = useNavigate();
    const role = Cookies.get('username');
    useEffect(()=>{
        if(role =="admin"){
            console.log(role);
            return navigate('/admin');
        }
        else if(!role){
            // navigate('/');
            //do nothing;
        }
        else {
            console.log(role);
            return navigate("/user");
        };
    }, []);
   

    const ErrorMessage = () => {
        return <p className='text-danger'>Wrong Username or Password</p>;
    }
    function onClickLogin(event) {
        event.preventDefault();
        // const [username, setUsername] = useState("");
        // const [password, setPassword] = useState("");
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const data = "username=" + username + "&password=" + password;
        if (username !== "" && password !== "") {
            fetch("http://34.204.136.172/api/login", {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                console.log(data.user, typeof (data.user))

                if (data.user == "admin") {
                    console.log("called")
                    navigate('/admin')
                }
                // else if (data.user == "Login Failed" || data.user == "Wrong username or password")
                //     setWrong(true);
                else navigate('/user')

            }).catch((e)=>{
                setWrong(true);
                console.log(e);
            });
        }
        // else {
        //     setWrong(true);
        //     console.log(isWrong)
        // }

    };


    return (
        <div className="bg-dark container-fluid vh-100">
            <h1 className='text-light'>Weather Web</h1>
            <div className="card bg-light mx-auto text-dark" style={{ "width": "50rem" }}>
                <div className="card-header">Login</div>
                <div className="card-body">
                    {isWrong ? <ErrorMessage /> : <div></div>}
                    <form onSubmit={onClickLogin}>
                        <div className="form-group my-3">
                            <label htmlFor="username">User name</label>
                            <input type="text" name="username" className="form-control" id="username" placeholder="User name" />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" className="form-control" id="password" placeholder="Password" />
                        </div>
                        <button type="submit" className="btn btn-secondary w-100">Submit</button>
                    </form>
                </div>
            </div>
        </div >)
};

export default Login;