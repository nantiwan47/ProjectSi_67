// Footer.js
import React from 'react';
import './AppFooter.css';

const AppFooter = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} ProjectSIDev products. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/" className="footer-link">Show Products</a>
                    <a href="/add" className="footer-link">Add Product</a>
                    <p className='pName'>Nantiwan Kongsri</p>
                </div>
            </div>
        </footer>
    );
};

export default AppFooter;
