import React,{useEffect,useState,Fragment, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Product from './Product';
import axiosClient from '../../config/axios';
import Spinner from '../layout/Spinner/Spinner';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';


function Products() {
    // products = state , saveProducts = function to save the state
    const [products,saveProducts] = useState([]);
    const [auth,saveAuth] = useContext(CRMContext);

    const navigate = useNavigate();
    
    // Query to the API
    const queryApi = async() => {
        try {
            const productQuery = await axiosClient.get('/products',{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
    
            if( productQuery === 403) {
                Swal.fire({
                    icon: "error",
                    title: "Acceso Denegado",
                    text: "No tienes permisos para acceder a esta sección.",
                });
                return;
            }
            saveProducts(productQuery.data);
        } catch (error) {
            // Error with Autorization 
            if(error.response.status === 500) {
                navigate('/login')
            }
        }
    }

    useEffect(() => {
        if(auth.token !== ''){
            queryApi();
        }else {
            navigate('/login');
        }
    },[]);

    const handleProductDelete = (id) => {
        saveProducts(products.filter(product => product._id !== id));
    }

    if(!auth.auth) {
        navigate('/login')
    }

    // Spinner
    if(!products.length ) return <Spinner/>

    return (
        <Fragment>
            <h2>Products</h2>
            <Link to={"/products/new"} className="btn btn-verde nvo-cliente"> 
                <i className="fas fa-plus-circle"></i>
                New Product
            </Link>

            <ul className="listado-productos">
                {products.map(product =>
                    (<Product
                        key={product._id}
                        product={product}
                        onDelete={handleProductDelete}
                    />)
                )}
            </ul>
        </Fragment>
    )
}

export default withAuth(Products);