import React,{useContext} from 'react';
import {Link} from 'react-router-dom';
import {CRMContext} from '../../context/CRMContext';

const Navigation = () => { 

    const [auth, ] = useContext(CRMContext);

    if(!auth.auth) return null;
    return (
        <aside className="sidebar col-3">
            <h2>Administración</h2>
            <nav className="navegacion">
                <Link to={"/"} className="clientes">Clients</Link>
                <Link to={"/products"} className="productos">Products</Link>
                <Link to={"/orders"} className="pedidos">Orders</Link>
            </nav>
        </aside>
    )
}
export default Navigation