import React,{Fragment, useState,useEffect,useContext} from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function UpdateClient(){

    // Get ID
    const { id} = useParams();

    // Token and Auth
    const [auth,saveAuth] = useContext(CRMContext);
    // client = state, clientData = setState
    const[client,clientData] = useState({
        name: '',
        lastname: '',
        company: '',
        email: '',
        celphone: ''
    });

    // Query to the API
    const queryApi = async () => {
        const queryClient = await axiosClient.get(`/clients/${id}`,{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });
        clientData(queryClient.data);
    }
    
    useEffect(() => {
        queryApi();
    },[]);

    const navigate = useNavigate();

    // Sends the request by Axios to update the clietn
    const handleSubmit = e => {
        e.preventDefault();

        // Send the request
        axiosClient.put(`/clients/${client._id}`, client,{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
            .then(res => {
                if(res.data.code === 11000) {
                    Swal.fire({
                        title: 'There was an error',
                        text: 'This client already exists',
                        icon: "error",
                    })
                } else {
                    Swal.fire({
                        title: "Correctly updated!",
                        text: res.data.message,
                        icon: "success"
                    });
                }
                navigate('/');
            });
    }

    // Read data from form
    const handleChange = e => {
        
        // Stores user's data in state
        clientData({
            // Get a copy of the state and modify it
            ...client,
            [e.target.name] : e.target.value
        })
    }


    // Validate the form
    const validateClient = () => {
        const {name,lastname,company,email,celphone} = client;

        // Check if the properties have a value

        let validate = !name.length || !lastname.length || !company.length || !email.length || !celphone.length;

        return validate;
    }

    if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
        navigate('/login')
    }

    return (
        <Fragment>
            <h1>Update Client</h1>

            <form onSubmit={handleSubmit}>
                <legend>Fill all the fields</legend>
                <div className="campo">
                    <label>Name:</label>
                    <input type="text" placeholder="Client name" name="name" onChange={handleChange} value={client.name || ''}/>
                </div>

                <div className="campo">
                    <label>Lastname:</label>
                    <input type="text" placeholder="Client lastname" name="lastname" onChange={handleChange} value={client.lastname || ''}/>
                </div>

                <div className="campo">
                    <label>Company:</label>
                    <input type="text" placeholder="Client company" name="company" onChange={handleChange} value={client.company || ''}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Client email" name="email" onChange={handleChange} value={client.email || ''}/>
                </div>

                <div className="campo">
                    <label>Cellphone:</label>
                    <input type="tel" placeholder="Client celphone" name="celphone" onChange={handleChange} value={client.celphone || ''}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Save Changes" disabled={validateClient()}/>
                </div>
            </form>
        </Fragment>
    )
}

// HOC , is a function that takes a component and returns a new component
export default withAuth(UpdateClient);