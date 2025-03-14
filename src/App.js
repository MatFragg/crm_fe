import React,{Fragment,useContext} from 'react';

// Routing 
import { BrowserRouter, Routes,Route } from 'react-router-dom';

// ** Layout ** //
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';

// ** Components ** //
import Clients from './components/clients/Clients';
import NewClient from './components/clients/NewClient';
import UpdateClient from './components/clients/UpdateClient';

import Products from './components/products/Products';
import NewProduct from './components/products/NewProduct';
import UpdateProduct from './components/products/UpdateProduct';

import Orders from './components/orders/Orders';
import NewOrder from './components/orders/NewOrder';
import UpdateOrder from './components/orders/UpdateOrder';

import Login from './components/auth/Login';

import {CRMContext, CRMProvider} from './context/CRMContext'

function App() {
    const [auth,saveAuth] = useContext(CRMContext);
    return (
        <BrowserRouter>
            <Fragment>
                <CRMProvider value={[auth,saveAuth]}>
                <Header/>
                    <div className="grid contenedor contenido-principal">
                        <Navigation/>
                        <main className="caja-contenido col-9">
                            {/*TODO :  Routing to the different components*/}
                            <Routes>
                                <Route path="/" element={<Clients/>}/>
                                <Route path="/clients/new" element={<NewClient/>}/>
                                <Route path="/clients/update/:id" element={<UpdateClient/>}/>

                                <Route path="/products" element={<Products/>}/>
                                <Route path="/products/new" element={<NewProduct/>}/>
                                <Route path="/products/update/:id" element={<UpdateProduct/>}/>
                                
                                <Route path="/orders" element={<Orders/>}/>
                                <Route path="/orders/new/:id" element={<NewOrder/>}/>
                                <Route path="/orders/update/:id" element={<UpdateOrder/>}/>

                                <Route path="/login" element={<Login/>}/>
                            </Routes>
                        </main>
                    </div>
                </CRMProvider>
            </Fragment>
        </BrowserRouter>
    );
}

export default App;
