import React,{useContext} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axiosClient from '../../config/axios';
import Swal from 'sweetalert2';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function OrderDetails({order}) {
    const [auth,saveAuth] = useContext(CRMContext);
    const navigate = useNavigate()

    if (!order || !order.client) {
        return <p className="error-message">Invalid order data</p>;
    }
    
    const {client } = order;

    const handleDeleteOrderClick = async id => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "An order that is deleted cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete it!',
            cancelButtonText: 'Cancel'
        })
        if (result.isConfirmed) {
            try {
                const res = await axiosClient.delete(`/orders/${id}`,{
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                if (res.status === 200) {
                    Swal.fire('Deleted!', res.data.message, 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete order', 'error');
            }
        }
    }

    return (
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">ID: {order._id}</p>
                <p className="nombre">Client: {client.name} {client.lastname} </p>

                <div className="articulos-pedido">
                    <p className="productos"> Ordered Items: </p>
                    {order.products?.length > 0 ? (
                        <ul>
                            {order.products.map(({ product, quantity }) => (
                                product && (
                                    <li key={`${order._id}-${product._id}`}>
                                        <p>{product.name}</p>
                                        <p>Precio: ${product.price}</p>
                                        <p>Quantity: {quantity}</p>
                                    </li>
                                )
                            ))}
                        </ul>
                    ) : (
                        <p>No products in this order</p>
                    )}
                </div>
                <p className="total">Total: ${order.total} </p>
            </div>
            <div className="acciones">
                <Link to={`/orders/update/${order._id}`} className="btn btn-azul">
                <i className="fas fa-pen-alt"></i>
                    Update Order
                </Link>

                <button type="button" className="btn btn-rojo btn-eliminar" onClick={() => handleDeleteOrderClick(order._id)}>
                    <i className="fas fa-times"></i>
                                Delete Order
                </button>
            </div>
        </li>
    )
}

export default withAuth(OrderDetails);