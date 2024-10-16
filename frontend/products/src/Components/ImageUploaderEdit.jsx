import React, { useState, useEffect } from 'react'; // นำเข้า React และ Hooks ที่จำเป็น
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2 สำหรับการแสดงข้อความ
import './ImageUploader.css'; // นำเข้าไฟล์ CSS สำหรับการจัดรูปแบบ


function ImageUploader({ onImageChange, initialImage }) {
  // ใช้ initialImage เป็นค่าเริ่มต้น ถ้ามีภาพจาก backend ให้แสดง
  const [previewImage, setPreviewImage] = useState(initialImage || '/images/no-image.png');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // สร้าง key สำหรับ input เพื่อช่วยในการรีเซ็ต


  // ตรวจสอบว่า initialImage เปลี่ยนแปลงเมื่อได้รับค่าใหม่
  useEffect(() => {
    if (initialImage) {
      setPreviewImage(initialImage); // อัปเดตภาพเมื่อมีภาพจาก backend
    }
  }, [initialImage]);

  // ฟังก์ชันเพื่อรีเซ็ตค่า previewImage และค่าใน onImageChange
  const resetImage = () => {
    setPreviewImage('/images/no-image.png'); // ตั้งค่าภาพตัวอย่างเป็น placeholder
    onImageChange(null); // ส่งค่า null กลับไปยังพ่อแม่เพื่อรีเซ็ตภาพ
    setFileInputKey(Date.now()); // สร้าง key ใหม่เพื่อรีเซ็ตค่า input

  };

  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงใน input file
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // รับไฟล์แรกจาก input
    if (file) {
      const isValidFileType = ['image/png', 'image/jpeg'].includes(file.type);
      if (!isValidFileType) {
        Swal.fire({
          icon: 'error',
          title: 'ไฟล์ไม่รองรับ',
          text: 'กรุณาอัปโหลดไฟล์รูปภาพที่เป็น PNG หรือ JPG เท่านั้น',
        });
        return;
      }
      onImageChange(file); // ส่งไฟล์ใหม่กลับไปให้ component แม่
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewImage(fileReader.result); // แสดงภาพใหม่ที่อัปโหลด
      };
      fileReader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
    }
  };

  return (
    <div className="image-uploader-wrapper">  
      <div className="image-preview-container"> 
        <img src={previewImage} alt="Uploaded Preview" className="preview-image" /> 
        {previewImage !== '/images/no-image.png' && (
          <button onClick={resetImage} className="remove-image-button">
            ลบรูปภาพ
          </button>
        )}
      </div>
      <div className="upload-button-container"> 
        <div className="upload-title">รูปภาพสินค้า</div> 
        <div className="upload-area">
          <input
            type="file"
            id="image-upload"
            key={fileInputKey} // ใช้ key เพื่อรีเซ็ตค่า input
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden-input"
          />
          <button
            type="button"
            onClick={() => document.getElementById('image-upload').click()} 
            className="upload-button"
          >
            อัปโหลดรูปภาพ
          </button>
          <p className="supported-file-info">ไฟล์ที่รองรับ PNG และ JPG</p> 
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;