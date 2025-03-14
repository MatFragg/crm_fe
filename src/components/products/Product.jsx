import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';
import {showDeniedAccessError} from '../../utils/alertService';

function Product({product,onDelete}) {
    const {_id,name,price,image} = product;
    const [auth,saveAuth] = useContext(CRMContext);


    const handleClick = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "A deleted Product can't be recovered!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/products/${id}`,{
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }).then(res => {
                    Swal.fire({
                        title: "Deleted!",
                        text: res.data.message,
                        icon: "success"
                    });
                    onDelete(id);
                }).catch(error => {
                    if(error.response.status === 403) {
                        showDeniedAccessError(error.response.data.message);
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: "There was an error deleting the product",
                            icon: "error"
                        });
                    }
                });
            }
        })
    };
    return (
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{name}</p>
                <p className="precio">{price}</p>
                { image ? (
                    <img src={`${process.env.REACT_APP_BACKEND}/${image}`} alt={name}/>
                ): null}
            </div>
            <div className="acciones">
                <Link to={`/products/update/${_id}`} className="btn btn-azul"><i className="fas fa-pen-alt"></i>Update Producto
                </Link>

                <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => handleClick(_id)}>
                    <i className="fas fa-times"></i>
                        Delete Product
                </button>
            </div>
        </li>
    )
}

export default withAuth(Product);