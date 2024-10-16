import { NavLink } from 'react-router-dom'; 
import { FaHome, FaPlus } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการ
import './AppHeader.css';

function AppHeader() {
    return (
        <header className="app-header">
            <NavLink 
                to="/" 
                className={({ isActive }) => 
                    isActive ? "app-header-item app-header-item-active" : "app-header-item"
                }
            >
                <FaHome className="header-icon" /> {/* เพิ่มไอคอน */}
                Show Products
            </NavLink>
            <NavLink 
                to="/add" 
                className={({ isActive }) => 
                    isActive ? "app-header-item app-header-item-active" : "app-header-item"
                }
            >
                <FaPlus className="header-icon" /> {/* เพิ่มไอคอน */}
                Add Product
            </NavLink>
        </header>
    );
}

export default AppHeader;
