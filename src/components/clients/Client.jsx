import React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';


function Client({client,onDelete}) {
    // Extract data
    const {_id,name,lastname,company,email,celphone} = client;
    const [auth,saveAuth] = useContext(CRMContext);


    const handleClick = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "A deleted client can't be recovered!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`/clients/${id}`,{
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                })
                .then(res => {
                    Swal.fire({
                        title: "Deleted!",
                        text: res.data.message,
                        icon: "success"
                    });
                    onDelete(id);
                })
            }
        });
    }

    return(
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{name} {lastname}</p>
                <p className="empresa">{company}</p>
                <p>{email}</p>
                <p>Tel: {celphone}</p>
            </div>
            <div className="acciones">
                <Link to={`/clients/update/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>Edit Client
                </Link>
                <Link to={`/orders/new/${_id}`} className="btn btn-amarillo">
                    <i className="fas fa-plus"></i>New Order
                </Link>
                <button type="button" className="btn btn-rojo btn-eliminar" onClick={()=> handleClick(_id)}>
                    <i className="fas fa-times"></i>Delete Client
                </button>
            </div>
        </li>
    )
}

export default withAuth(Client);