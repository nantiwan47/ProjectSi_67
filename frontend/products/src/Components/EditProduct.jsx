import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageUploaderEdit from './ImageUploaderEdit';
import { useForm } from 'react-hook-form';
import { FaTrash } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import './AddProduct.css';
import Swal from 'sweetalert2';

function EditProduct() {
  const { id } = useParams(); // Get the product ID from the URL
  const { register, handleSubmit, setValue } = useForm();
  //const [product, setProduct] = useState(null); // เก็บข้อมูลสินค้าที่จะถูกแก้ไข new
  const [colors, setColors] = useState(['']); // State for colors
  const [sizes, setSizes] = useState(['']); // State for sizes
  const [image, setImage] = useState(null); // State for image
  const navigate = useNavigate();

  // ดึงข้อมูลสินค้าที่ต้องการแก้ไข สำหรับ patch
  // useEffect(() => {
  //   axios.get(`http://localhost:8000/products/${id}/`)
  //     .then(response => {
  //       const productData = response.data;
  //       setProduct(productData); // เก็บข้อมูลสินค้าใน state
  //       setValue('name', productData.name);
  //       setValue('description', productData.description);
  //       setValue('category', productData.category);
  //       setValue('price', productData.price);
  //       setColors(productData.colors || ['']);
  //       setSizes(productData.sizes || ['']);
  //       setImage(productData.image);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching product:', error);
  //       Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถโหลดข้อมูลสินค้าได้.', 'error');
  //     });
  // }, [id, setValue]);


  useEffect(() => {
    // ดึงข้อมูลสินค้าที่ต้องการแก้ไข
    axios.get(`http://localhost:8000/products/${id}/`)
      .then(response => {
        const product = response.data;
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('category', product.category);
        setValue('price', product.price);
        setColors(product.colors || ['']);
        setSizes(product.sizes || ['']);
        setImage(product.image);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถโหลดข้อมูลสินค้าได้.', 'error');
      });
  }, [id, setValue]);

  const handleColorChange = (index, e) => {
    const newColors = [...colors];
    newColors[index] = e.target.value; // Update the color value
    setColors(newColors);
  };

  const addColor = () => {
    setColors([...colors, '']); // Add a new color input
  };

  const removeColor = (index) => {
    const newColors = colors.filter((_, i) => i !== index); // Remove selected color
    setColors(newColors);
  };

  const handleSizeChange = (index, e) => {
    const newSizes = [...sizes];
    newSizes[index] = e.target.value; // Update the size value
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, '']); // Add a new size input
  };

  const removeSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index); // Remove selected size
    setSizes(newSizes);
  };

  const renderColorInputs = () => (
    colors.map((color, index) => (
      <div key={index} className="color-input-group">
        <input
          type="text"
          value={color}
          onChange={(e) => handleColorChange(index, e)}
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
    // เช็คฟิลด์ว่ามีการเปลี่ยนแปลงไหม
    // if (data.name !== product.name) formData.append('name', data.name);
    // if (data.description !== product.description) formData.append('description', data.description);
    // if (data.category !== product.category) formData.append('category', data.category);
    // if (data.price !== product.price) formData.append('price', data.price);
    // if (JSON.stringify(colors) !== JSON.stringify(product.colors)) formData.append('colors', JSON.stringify(colors));
    // if (JSON.stringify(sizes) !== JSON.stringify(product.sizes)) formData.append('sizes', JSON.stringify(sizes));

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price);
    formData.append('colors', JSON.stringify(colors));
    formData.append('sizes', JSON.stringify(sizes));

    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.patch(`http://localhost:8000/products/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Product updated:', response.data);

      // แสดงการแจ้งเตือนเมื่อแก้ไขสำเร็จ
      await Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: 'แก้ไขสินค้าเรียบร้อยแล้ว',
        confirmButtonText: 'ตกลง'
      });

      navigate('/');
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถแก้ไขสินค้าได้.', 'error');
    }
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <div className="form-container">
          <h2 className='from-title'>ข้อมูลทั่วไป</h2>
          <div className="form-group">
            <label htmlFor="name">ชื่อสินค้า</label>
            <input
              type="text"
              id="name"
              {...register('name', { required: true })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">รายละเอียดสินค้า</label>
            <textarea
              id="description"
              {...register('description', { required: true })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" {...register('category', { required: true })}>
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
          <h2 className='from-title'>ข้อมูลการขาย</h2>
          <div className="form-group">
            <label htmlFor="price">ราคา</label>
            <input
              type="number"
              id="price"
              {...register('price', { required: true })}
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
          <h2 className='from-title'>ข้อมูลรูปภาพ</h2>
          <div className="form-group">
            <ImageUploaderEdit
              onImageChange={setImage}
              initialImage={image ? `http://localhost:8000${image}` : null}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/')} className="cancel-button">ยกเลิก</button>
          <button type="submit" className="submit-button">แก้ไขสินค้า</button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;