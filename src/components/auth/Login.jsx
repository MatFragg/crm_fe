import React,{useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';

import { CRMContext } from '../../context/CRMContext';

function Login() {
    // Token and Auth
    const [,saveAuth] = useContext(CRMContext);

    // State with the data reading
    const [credentials,saveCredentials] = useState({});
    const navigate = useNavigate();

    const handleLoginSubmit = async e => {
        e.preventDefault();

        // autenticate the user
        try {
            const result = await axiosClient.post('/login',credentials);
            // extract the token and save it in the local storage
            const {token} = result.data;
            localStorage.setItem('token',token);

            // Put the token on the state
            saveAuth({
                token,
                auth: true
            })

            Swal.fire({
                icon: 'success',
                title: 'Login Successful'
            })

            // redirect
            navigate('/');

        } catch (error) {
            if (error.response){
                Swal.fire({
                    icon: 'error',
                    title: 'There was an error',
                    text: error.response.data.message
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'There was an error',
                    text: 'Error in the server, try again later'
                })
            }
        }
    }

    const handleDataReadingChange = e => {
        saveCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    return(
        <div className="login">
            <h2>Login</h2>

            <div className="contenedor-formulario">
                <form onSubmit={handleLoginSubmit}>
                    <div className="campo">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="Your Email" required onChange={handleDataReadingChange} />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Your Password" required onChange={handleDataReadingChange} />
                    </div>
                    
                    <input type="submit" value="Login" className="btn btn-verde btn-block"/>        

                </form>
            </div>
        </div>
    )
}   

export default Login;