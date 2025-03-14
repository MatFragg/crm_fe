import React,{Fragment, useEffect, useState,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import Spinner from '../layout/Spinner/Spinner';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function UpdateProduct() {
    // get the id 
    const {id} = useParams();

    const [auth,saveAuth] = useContext(CRMContext);
    
    // product = state, saveProduct = setState
    const [product,saveProduct] = useState({
        name: '',
        price: '',
        image: ''
    });

    const [archive,saveArchive] = useState(null);

    const navigate = useNavigate();

    // Query to the API
    const queryApi = async() => {
        try {
            const productQuery = await axiosClient.get(`/products/${id}`,{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            saveProduct(productQuery.data);
        } catch (error) {
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
    }, [auth.token, navigate])

    // Read data from form
    const handleChange = e => {
        saveProduct({
            ...product,
            [e.target.name] : e.target.value
        })
    }

    // Read the image from the form in the State
    const handleArchive = e => {
        saveArchive(e.target.files[0]);
    }
    
    const handleSubmit = async e => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name',product.name);
        formData.append('price',product.price);
        formData.append('image',archive);

        // Log the form data
        for (let [key, value] of formData.entries()) {

        }

        try {
            const res = await axiosClient.put(`/products/${id}`, formData,{headers: {  Authorization: `Bearer ${auth.token}`, 'Content-Type': 'multipart/form-data' }});
            if(res.status === 200){
                Swal.fire({
                    title: 'Product Updated!',
                    text: res.data.message,
                    icon: 'success'
                })
            }
            navigate('/products');
        } catch (error) {
            console.error(error.response.data);
            Swal.fire({
                title: 'There was an error',
                text: 'This product cannot be updated right now',
                icon: 'error'
            });
        }
    }

    // Extract data from state
    const { name, price,image } = product;

    if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
        navigate('/login')
    }

    if(!name) return <Spinner/>
    return (
        <Fragment>
            <h2>Update Product</h2>

            <form onSubmit={handleSubmit}>
                <legend>Fill all the fields</legend>

                <div className="campo">
                    <label>Name:</label>
                    <input type="text" placeholder="Product Name" name="name" value={name || ''} onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Price:</label>
                    <input type="number" name="price" min="0.00" step="0.01" placeholder="Price" value={price || ''} onChange={handleChange}/>
                </div>
            
                <div className="campo">
                    <label>Image:</label>
                    { image ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}${image}`} alt={name} width="300"/>
                    ) : null }
                    <input type="file" name="image" onChange={handleArchive}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Update Product"/>
                </div>
            </form>
        </Fragment>
    )
}

export default withAuth(UpdateProduct);