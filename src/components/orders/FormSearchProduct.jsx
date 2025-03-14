import React from 'react';

function FormSearchProduct(props) {
    return (
        <form onSubmit={props.handleSearchFormSubmit}>
            <legend>Search for a product and add the price</legend>
                <div className="campo">
                    <label>Products:</label>
                    <input type="text" placeholder="Products Name" name="products" onChange={props.handleSearchChange} />
                </div>

                <input type="submit" className="btn btn-azul btn-block" value="Search Product"/>
        </form>

    )
}

export default FormSearchProduct;