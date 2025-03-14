import React, { useContext} from "react";
import { useNavigate } from "react-router-dom";
import {CRMContext} from "../../context/CRMContext";


// For stateless components, we can use arrow functions.
const Header = () => {
    // We can use the context here.
    const [auth, guardarAuth] = useContext(CRMContext);
    const navigate = useNavigate();

    const handleCloseSessionClick = () => {
        // auth.auth = false , taken is removed
        guardarAuth({
            token: '',
            auth: false
        })

        localStorage.setItem('token', '');

        navigate('/login');
    }

    return (
        <header className="barra">
            <div className="contenedor">
                <div className="contenido-barra">
                    <h1>CRM - Administrador de Clientes</h1>
                    { auth.auth ? (  
                        <button type="button" className="btn btn-rojo" onClick={handleCloseSessionClick}>
                            <i className="far fa-times-circle"></i>
                            Cerrar Sesión
                        </button> 
                    ) : null }
                </div>
            </div>
        </header>
    )
}

export default Header;