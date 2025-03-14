import React,{useEffect,Fragment,useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import OrderDetails from './OrderDetails';
import axiosClient from '../../config/axios';
import Spinner from '../layout/Spinner/Spinner';

import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function Orders() {
    const [auth,saveAuth] = useContext(CRMContext);
    const [orders,saveOrders] = useState([]);

    const navigate = useNavigate()

    const queryApi = async() => {
        try {
            const ordersQuery = await axiosClient.get('/orders',{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            saveOrders(ordersQuery.data);
        } catch (error) {

            // Error with Autorization 
            if(error.response.status === 500) {
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        if(auth.token !== '') {
            queryApi();
        } else { 
            navigate('/login')
        }
    },[orders])

    if(!auth.auth) {
        navigate('/login')
    }

    if(!orders.length) return <Spinner/>
    return (
        <Fragment>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {orders.map(order => (<OrderDetails key={order._id} order={order} />))}
            </ul>
        </Fragment>

    )
}

export default withAuth(Orders);