import { Routes, Route } from 'react-router-dom';
import AppHeader from './Components/AppHeader';
import AddProduct from './Components/AddProduct';
import ProductList from './Components/ProductList';
import EditProduct from './Components/EditProduct';
import AppFooter from './Components/AppFooter';

const App = () => {
    return (
        <>
            <AppHeader />
            <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/add" element={<AddProduct />} />
                <Route path="/edit/:id" element={<EditProduct />} />
            </Routes>
            <AppFooter />
        </>
    );
};

export default App;