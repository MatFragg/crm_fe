import React,{Fragment, useState,useContext, useEffect} from 'react';
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

const NewClient = () => {
    // Token and Auth
    const [auth,saveAuth] = useContext(CRMContext);

    // client = state, saveClients = setState
    const[client,saveClient] = useState({
        name: '',
        lastname: '',
        company: '',
        email: '',
        celphone: ''
    });

    const navigate = useNavigate();

    // Read data from form
    const handleChange = async e => {
        // Stores user's data in state
        saveClient({
            // Get a copy of the state and modify it
            ...client,
            [e.target.name] : e.target.value
        })

    }

    useEffect(() => {
        if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
            navigate('/login')
        }
    });

    const handleSubmit = async e => {
        e.preventDefault();

        // Send the request
        const resultPost = await axiosClient.post('/clients', client,{
            headers : {
                Authorization : `Bearer ${auth.token}`
            }});
            
            // Validate if there are mongo errors
            if(resultPost.data.code === 11000) {
                Swal.fire({
                    title: 'There was an error',
                    text: 'This client already exists',
                    icon: "error",
                })
            } else {
                Swal.fire({
                    title: "Client added!",
                    text: resultPost.data.message,
                    icon: "success"
                });
            }

            // Redirect
            navigate('/');
    }

    // Validate the form
    const validateClient = () => {
        const {name,lastname,company,email,celphone} = client;

        // Check if the properties have a value

        let validate = !name.length || !lastname.length || !company.length || !email.length || !celphone.length;

        return validate;
    }


    // Verify if user is auth
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
        navigate('/login')
    }

    return (
        <Fragment>
            <h2>New Client</h2>

            <form onSubmit={handleSubmit}>
                <legend>Fill all the fields</legend>
                <div className="campo">
                    <label>Name:</label>
                    <input type="text" placeholder="Client name" name="name" onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Lastname:</label>
                    <input type="text" placeholder="Client lastname" name="lastname" onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Company:</label>
                    <input type="text" placeholder="Client company" name="company" onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Client email" name="email" onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Cellphone:</label>
                    <input type="tel" placeholder="Client celphone" name="celphone" onChange={handleChange}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Add Client" disabled={validateClient()}/>
                </div>
            </form>
        </Fragment>
    )
}

// HOC , is a function that takes a component and returns a new component
export default withAuth(NewClient);