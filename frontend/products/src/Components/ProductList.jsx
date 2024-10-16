import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]); // สร้าง state สำหรับรายการสินค้า
    const [loading, setLoading] = useState(true); // สร้าง state สำหรับสถานะการโหลด
    const [error, setError] = useState(null); // สร้าง state สำหรับข้อผิดพลาด
    const navigate = useNavigate(); // สร้าง instance ของ navigate

    // ฟังก์ชันสำหรับดึงข้อมูลสินค้า
    const getProducts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8000/products/'); // ดึงข้อมูลจาก API
            setProducts(response.data); // ตั้งค่ารายการสินค้าจากข้อมูลที่ได้
            setLoading(false);
        } catch (error) {
            // จัดการข้อผิดพลาด
            if (error.response) {
                setError(`Server responded with status ${error.response.status}`);
            } else if (error.request) {
                setError("No response from server. Please check your network connection.");
            } else {
                setError("An error occurred: " + error.message);
            }
            setLoading(false);
        }
    }, []); // [] หมายถึงฟังก์ชันนี้จะถูกเรียกใช้เมื่อคอมโพเนนต์ mount

    useEffect(() => {
        getProducts();  // เรียกใช้ฟังก์ชัน getProducts เมื่อคอมโพเนนต์ mount
    }, [getProducts]); // จะเรียกใช้ใหม่เมื่อ getProducts เปลี่ยน

    // ฟังก์ชันสำหรับลบสินค้า
    const deleteProduct = useCallback(async (id) => {
        const result = await Swal.fire({
            title: 'ลบสินค้านี้หรือไม่?',
            text: "เมื่อสินค้านี้ถูกลบ คุณจะไม่สามารถกู้คืนได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#B0BEC5',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/products/${id}/`); // ส่งคำขอลบสินค้าไปยัง API
                setProducts(products.filter(product => product._id !== id)); // อัปเดตรายการสินค้า
                Swal.fire('Deleted!', 'สินค้าของคุณถูกลบเรียบร้อยแล้ว', 'success'); // แสดงข้อความยืนยันการลบ
            } catch (error) {
                Swal.fire('Error!', error.message, 'error');
            }
        }
    }, [products]); // [products] หมายถึงจะสร้างใหม่เมื่อ products เปลี่ยน

    // แสดงสถานะการโหลดหรือข้อผิดพลาด
    if (loading) return <p>Loading...</p>; // แสดงข้อความเมื่อกำลังโหลด
    if (error) return (
        <div>
            <p>Error: {error}</p>
            <button onClick={getProducts}>Retry</button> {/* ปุ่มลองใหม่ */}
        </div>
    );

    // แสดงตารางรายการสินค้า
    return (
        <div className="container">
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Descrition</th>
                        <th>Price</th>
                        <th>Colors</th>
                        <th>Sizes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr><td colSpan="8">No products available.</td></tr>  // แสดงข้อความหากไม่มีสินค้า
                    ) : (
                        products.map((product) => ( // แสดงสินค้าทั้งหมดในตาราง
                            <tr key={product._id}>
                                <td>
                                    {product.image ? (
                                        <img
                                            src={`http://localhost:8000/${product.image}`}
                                            alt={product.name}
                                        />
                                    ) : (
                                        <img
                                            src="/images/no-image.png"
                                            alt="No Image"
                                        />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.colors?.join(', ') || "ไม่มีสี"}</td>
                                <td>{product.sizes?.join(', ') || "ไม่มีขนาด"}</td>
                                <td>
                                    <div className='actions'>
                                        <button className="action-edit" onClick={() => navigate(`/edit/${product._id}`)}>
                                            <FaEdit />
                                        </button>
                                        <button className="action-delete" onClick={() => deleteProduct(product._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList; 