import React,{useEffect,useState,Fragment, useContext} from 'react';
import axiosClient from '../../config/axios';
import Client from './Client';
import {Link, useNavigate } from 'react-router-dom';
import Spinner from '../layout/Spinner/Spinner';

import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function Clients() {
    // Working with useState
    const [clients,saveClients] = useState([]);
    const [auth,saveAuth] = useContext(CRMContext);
    
    const navigate = useNavigate()

    const queryApi = async() => {
        try {
            const clientsQuery = await axiosClient.get('/clients',{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
    
            saveClients(clientsQuery.data);

        } catch (error) {
            // Error with Autorization 
            if(error.response.status === 500) {
                navigate('/login')
            }
        }
    }
    // UseEffect is simillar to componentDidMount and componentWillmount
    useEffect(() => {
        if(auth.token !== '') {
            queryApi();
        } else {
            navigate('/login')
        }
    },[]);

    const handleClientDelete = (id) => {
        saveClients(clients.filter(client => client._id !== id));
    }

    if(!auth.auth) {
        navigate('/login')
    }

    // Spinner
    if(!clients.length) return <Spinner/>

    return (
        <Fragment>
            <h2>Clients</h2>
            <Link to={"/clients/new"} className="btn btn-verde nvo-cliente"> 
                <i className="fas fa-plus-circle"></i>
                New Client
            </Link>
            
            <ul className="listado-clientes">
                {clients.map(client => 
                    (<Client
                        key={client._id}
                        client={client}
                        onDelete={handleClientDelete}
                    />)
                )}
            </ul>
        </Fragment>
    )
}

export default withAuth(Clients);