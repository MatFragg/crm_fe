import React,{Fragment, useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function NewProduct() {
    const [auth,saveAuth] = useContext(CRMContext);
    // client = state, saveClients = setState
    const [product,saveProduct] = useState({
        name: '',
        price: ''
    });

    // archive = state, saveArchive = setState
    const [archive,saveArchive] = useState(null);

    const navigate = useNavigate();
    
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
            console.log(`${key}: ${value}`);
        }

        try {
            const res = await axiosClient.post('/products', formData,{
                headers: { 
                    Authorization : `Bearer ${auth.token}`,
                    'Content-Type': 'multipart/form-data' }
            });
            
            if(res.status === 200){
                Swal.fire({
                    title: 'Product added!',
                    text: res.data.message,
                    icon: 'success'
                })
            }
            navigate('/products');
        } catch (error) {
            Swal.fire({
                title: 'There was an error',
                text: 'This product already exists',
                icon: 'error'
            });
        }
    }

    const validateProduct = () => {
        const {name ,price} = product;

        let validate = !name.length || !price.length || !archive;
        
        return validate;
    };

    // Verify if user is auth
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) {
        navigate('/login')
    }

    return (
        <Fragment>
            <h2>New Product</h2>

            <form onSubmit={handleSubmit}>
                <legend>Fill all the fields</legend>

                <div className="campo">
                    <label>Name:</label>
                    <input type="text" placeholder="Product Name" name="name" onChange={handleChange}/>
                </div>

                <div className="campo">
                    <label>Price:</label>
                    <input type="number" name="price" min="0.00" step="0.01" placeholder="Price" onChange={handleChange}/>
                </div>
            
                <div className="campo">
                    <label>Image:</label>
                    <input type="file" name="image" onChange={handleArchive}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Add Product"
                    disabled={validateProduct()}/>
                </div>
            </form>
        </Fragment>
    )
}

export default withAuth(NewProduct);