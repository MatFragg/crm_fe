import React from 'react';

function FormProductQuantity(props) {
    const {product,handleDecreaseClick , handleIncreaseClick,handleClickDP,index} = props;
    return (
        <li>
            <div className="texto-producto">
                <p className="nombre">{product.name}</p>
                <p className="precio">Price: $ {product.price}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i className="fas fa-minus" onClick={() => handleDecreaseClick(index)}></i>
                    <p>{product.quantity}</p>
                    <i className="fas fa-plus" onClick={() => handleIncreaseClick(index)}></i>
                </div>
                    <button type="button" className="btn btn-rojo" onClick={() => handleClickDP(product._id)}>
                    <i className="fas fa-minus-circle"></i>
                        Delete Product
                </button>
            </div>
        </li>
    )
}

export default FormProductQuantity;