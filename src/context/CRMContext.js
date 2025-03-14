import React,{useState} from 'react';

const CRMContext = React.createContext([{}, () => {}]);
const CRMProvider = props => {
    const token = localStorage.getItem('token');
    const [auth,saveAuth] = useState({
        token,
        auth: token ? true : false
    });

    return (
        <CRMContext.Provider value={[auth,saveAuth]}>
            {props.children}
        </CRMContext.Provider>
    )
}
export {
    CRMContext,
    CRMProvider
}