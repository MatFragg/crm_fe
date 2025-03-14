import React,{useState,useEffect,Fragment,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import Spinner from '../layout/Spinner/Spinner';
import FormSearchProduct from './FormSearchProduct';
import FormProductQuantity from './FormProductQuantity';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function NewOrder() {
    // Extract id from the Client
    const { id} = useParams();
    const [auth,saveAuth] = useContext(CRMContext);    
    const navigate = useNavigate();


    const [client,saveClient] = useState({});
    const [search,saveSearch] = useState('');
    const [products,saveProducts] = useState([]);
    const [total,saveTotal] = useState(0);

    const queryApi = async () => {
        try {
            const clientQuery = await axiosClient.get(`/clients/${id}`,{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            saveClient(clientQuery.data);
        } catch (error) {
            // Error with Autorization 
            if(error.response.status === 500) {
                navigate('/login')
            }
        }
    }
    useEffect(() => {
        if(auth.token !== '') {
            queryApi();
            updateTotal();
        } else { 
            navigate('/login')
        }
    },[products])


    const handleSearchFormSubmit = async e => {
        e.preventDefault();

        // Get the products by search
        const searchResult = await axiosClient.post(`/products/search/${search}`,'',{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        // if the result is empty , show an alert

        if(searchResult.data[0]) {
            let productResult = searchResult.data[0];

            // add product key (id's copy)

            productResult.product = searchResult.data[0]._id;
            productResult.quantity = 0;

            // put the product in the state
            saveProducts([...products,productResult]);
            
        } else {
            // there are not results
            Swal.fire({
                title: "No results",
                text: "There are not results for the search",
                icon: "error"
            })
        }

    }

    // Read a search in the state
    const handleSearchChange = e => {
        saveSearch(e.target.value);
    }

    // Update the quantity of the products
    const handleDecreaseClick = i => {
        const newProducts = [...products];

        // Validate if the quantity is 0
        if(newProducts[i].quantity === 0) return;

        newProducts[i].quantity--;

        // Save in the state
        saveProducts(newProducts);
    }
    
    const handleIncreaseClick = i => {
        const newProducts = [...products];
        newProducts[i].quantity++;
        saveProducts(newProducts);
    }

    // Delete a Product from the State
    const handleClickDP = id => {
        const allProducts = products.filter(product => product.product !== id);
        saveProducts(allProducts);
    }  

    // Update the total
    const updateTotal = () => {

        // if there are not products
        if(products.length === 0) {
            saveTotal(0);
            return;
        }

        // Calculate the new total
        let newTotal = 0;

        // Iterate all the products, their quantity and prices
        products.map(product => newTotal += (product.quantity * product.price));

        // Store the total
        saveTotal(newTotal);
    }

    // Store the order in the DB
    const handleOrderSubmit = async e => {
        e.preventDefault();

        // Build the order object
        const order = {
            "client" : id,
            "products" : products,
            "total" : total
        }

        const result = await axiosClient.post(`/orders/${id}`,order,{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        });

        // Read result

        if(result.status === 200) {
            Swal.fire({
                title: "Order Added",
                text: result.data.message,
                icon: "success"
            });
        } else {
            Swal.fire({
                title: "Error",
                text: result.data.message,
                icon: "error"
            });
        }

        // Redirect
        navigate('/orders');
    }   

    return (
        <Fragment>
            <h2>New Order</h2>
            <div className="ficha-cliente">
                <h3>Client Data</h3>
                <p>Name: {client.name} {client.lastname}</p>
                <p>Cel: {client.celphone}</p>
            </div>
            
            <FormSearchProduct handleSearchFormSubmit={handleSearchFormSubmit} handleSearchChange={handleSearchChange}/>

            <ul className="resumen">
                {products.map((product,index) => (
                    <FormProductQuantity
                        key={product.product}
                        index={index}
                        product={product}
                        handleDecreaseClick={handleDecreaseClick}
                        handleIncreaseClick={handleIncreaseClick}
                        handleClickDP={handleClickDP}
                    />
                ))}
            </ul>
            <div className="campo">
                <label>Total:</label>
                <input type="number" name="price" placeholder="Price" readOnly="readonly" value={total} />
            </div>

            {total > 0 ? ( 
                <form onSubmit={handleOrderSubmit}>
                    <div className="enviar">
                        <input type="submit" className="btn btn-verde btn-block" value="Add Order"/>
                    </div>
                </form>
            ): null}
        </Fragment>
    )
}

export default withAuth(NewOrder);