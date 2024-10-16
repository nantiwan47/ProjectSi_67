import React, { useState } from 'react'; 
import axios from 'axios';
import ImageUploader from './ImageUploader';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2
import './AddProduct.css';

function AddProduct() {
  const { register, handleSubmit, reset } = useForm();
  const [colors, setColors] = useState(['']); 
  const [sizes, setSizes] = useState(['']); 
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleColorChange = (index, e) => {
    const newColors = [...colors];
    newColors[index] = e.target.value;
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, '']);
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  const handleSizeChange = (index, e) => {
    const newSizes = [...sizes];
    newSizes[index] = e.target.value;
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, '']);
  };

  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const renderColorInputs = () => (
    colors.map((color, index) => (
      <div key={index} className="color-input-group">
        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(index, e)}
          name={`color_${index}`} // กำหนด name attribute
          id={`color_${index}`} // กำหนด id attribute
        />
        {index !== 0 && (
          <button type="button" onClick={() => removeColor(index)} className="remove-color-btn">
            <FaTrash />
          </button>
        )}
      </div>
    ))
  );

  const renderSizeInputs = () => (
    sizes.map((size, index) => (
      <div key={index} className="size-input-group">
        <input
          type="text"
          value={size}
          onChange={(e) => handleSizeChange(index, e)}
          name={`size_${index}`} // กำหนด name attribute
          id={`size_${index}`} // กำหนด id attribute
        />
        {index !== 0 && (
          <button type="button" onClick={() => removeSize(index)} className="remove-size-btn">
            <FaTrash />
          </button>
        )}
      </div>
    ))
  );

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price);
    formData.append('colors', JSON.stringify(colors));
    formData.append('sizes', JSON.stringify(sizes));

    if (image) formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8000/products/', formData, 
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      console.log('Product submitted:', response.data);

      // แสดงการแจ้งเตือนเมื่อเพิ่มสินค้าเสร็จสิ้น
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'เพิ่มสินค้าสำเร็จแล้ว!',
        icon: 'success',
        confirmButtonText: 'ตกลง',
      });

      // รีเซ็ตข้อมูลในแบบฟอร์ม
      reset();
      setColors(['']);
      setSizes(['']);
      setImage(null); // รีเซ็ตภาพ
    } catch (error) {
      console.error('Error submitting product:', error);
      // แสดงการแจ้งเตือนเมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง.',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <div className="form-container">
          <h2 className='form-title'>ข้อมูลทั่วไป</h2>
          <div className="form-group">
            <label htmlFor="name">ชื่อสินค้า</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: true })}
              name="name" // กำหนด name attribute
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">รายละเอียดสินค้า</label>
            <textarea
              id="description"
              {...register('description', { required: true })}
              name="description" // กำหนด name attribute
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" {...register('category', { required: true })} name="category">
              <option value="">เลือกหมวดหมู่</option>
              <option value="Blouse">Blouse</option>
              <option value="Dress">Dress</option>
              <option value="Jacket">Jacket</option>
              <option value="Jeans">Jeans</option>
              <option value="Shirt">Shirt</option>
              <option value="Shoes">Shoes</option>
              <option value="Shorts">Shorts</option>
              <option value="Skirt">Skirt</option>
            </select>
          </div>
        </div>

        <div className="form-container">
          <h2 className='form-title'>ข้อมูลการขาย</h2>
          <div className="form-group">
            <label htmlFor="price">ราคา</label>
            <input
              type="number"
              id="price"
              {...register('price', { required: true })}
              name="price" // กำหนด name attribute
            />
          </div>
          <div className="form-group">
            <label htmlFor="colors">สี</label>
            {renderColorInputs()}
            <button type="button" onClick={addColor} className="add-color-btn">
              <IoMdAddCircleOutline className="icon" /> เพิ่มสี
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="sizes">ขนาด</label>
            {renderSizeInputs()}
            <button type="button" onClick={addSize} className="add-size-btn">
              <IoMdAddCircleOutline className="icon" /> เพิ่มขนาด
            </button>
          </div>
        </div>

        <div className="form-container">
          <h2 className='form-title'>ข้อมูลรูปภาพ</h2>
          <div className="form-group">
            <ImageUploader onImageChange={setImage} reset={image === null} /> {/* ส่ง prop reset */}
          </div>
        </div>
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/')} className="cancel-button">ยกเลิก</button>
          <button type="submit" className="submit-button">เพิ่มสินค้า</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
