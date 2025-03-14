import React,{useEffect,useState,useContext} from 'react';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import { CRMContext } from '../context/CRMContext';
import { isTokenExpired } from '../utils/auth';

const withAuth = (WrappedComponent) => {
    return (props) => {
        // Token and Auth
        const [auth,saveAuth] = useContext(CRMContext);
        const navigate = useNavigate();
        const token = localStorage.getItem('token');
        const [isTokenValid, setIsTokenValid] = useState(true);

        useEffect(() => {
            if(!auth.auth || isTokenExpired(token)) {
                localStorage.removeItem('token');
                saveAuth({
                    token: '',
                    auth: false
                });
                Swal.fire({
                    title: 'Token Expired',
                    text: 'Please log in again',
                    icon: 'warning'
                })
                navigate('/login')
            }
        },[auth,token,navigate]);

        return <WrappedComponent {...props}/>
    }
}

export default withAuth;