import React,{Fragment,useEffect,useState,useContext} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axiosClient from '../../config/axios';
import Spinner from '../layout/Spinner/Spinner';
import FormSearchProduct from './FormSearchProduct';
import FormProductQuantity from './FormProductQuantity';
import { CRMContext } from '../../context/CRMContext';
import withAuth from '../../hoc/withAuth';

function UpdateOrder() {
    // Extract id from the Client
    const { id} = useParams();
    const navigate = useNavigate();
    
    const [order,saveOrder] = useState({});
    const [client,saveClient] = useState({});
    const [search,saveSearch] = useState('');
    const [products,saveProducts] = useState([]);
    const [total,saveTotal] = useState(0);

    const [auth,saveAuth] = useContext(CRMContext);
    

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await axiosClient.get(`/orders/${id}`,{
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                saveOrder(result.data);
                saveClient(result.data.client);
                saveProducts(result.data.products.map(p => ({ ...p.product, quantity: p.quantity })));                
                saveTotal(result.data.total);
            } catch (error) {
                if(error.response.status === 500) {
                    navigate('/login')
                }
            }
        }

        if(auth.token !== '') {
            fetchOrder();
        } else {
            navigate('/login')
        }
    },[id])


    useEffect(() => {
        updateTotal();
    },[products]);
    
    const updateTotal = () => {
        let newTotal = 0;
        products.forEach(product => {
            newTotal += (product.quantity || 0) * (product.price || 0);
        });
        saveTotal(newTotal);
    };

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
        updateTotal(); 
    }
    
    const handleIncreaseClick = i => {
        const newProducts = [...products];
        newProducts[i].quantity++;
        saveProducts(newProducts);
        updateTotal(); 
    }

    // Delete a Product from the State
    const handleClickDP = id => {
        const allProducts = products.filter(product => product.product !== id);
        saveProducts(allProducts);
        updateTotal();
    }  

    // Store the order in the DB
    const handleOrderSubmit = async e => {
        e.preventDefault();

        // Build the order object
        /*const order = {
            client : client._id,
            products : products,
            total : total
        };*/

        if(!client._id){
            Swal.fire({
                title: "Error",
                text: "Client data is missing",
                icon: "Error"
            });
            return;
        }

        const order = {
            client: client._id,
            products: products.map(p => ({
                product: p._id, 
                quantity: p.quantity
            })),
            total: total
        };

        try {
            const result = await axiosClient.put(`/orders/${id}`,order,{
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            // Read result
            if(result.status === 200) {
                Swal.fire({
                    title: "Order Updated Successfully",
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
            navigate('/orders');

        } catch (error) {
            console.error(error.response.data);
            Swal.fire({
                title: "Error",
                text: "There was an error updating the order",
                icon: "error"
            });
        }
    }   

    
    if(!auth.auth) {
        navigate('/login')
    }


    if (!order || !client) {
        return <Spinner />;
    }

    return (
        <Fragment>
            <h2>Update Order</h2>
            <div className="ficha-cliente">
                <h3>Client Data</h3>
                <p>Name: {client.name} {client.lastname}</p>
                <p>Cel: {client.celphone}</p>
            </div>
            
            <FormSearchProduct handleSearchFormSubmit={handleSearchFormSubmit} handleSearchChange={handleSearchChange}/>

            <ul className="resumen">
                {products.map((product,index) => (
                    <FormProductQuantity
                        key={product._id || product.product}
                        product={product}
                        index={index}
                        handleDecreaseClick={() => handleDecreaseClick(index)}
                        handleIncreaseClick={() =>handleIncreaseClick(index)}
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

export default withAuth(UpdateOrder);