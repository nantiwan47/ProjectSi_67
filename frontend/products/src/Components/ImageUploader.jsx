import React, { useState, useEffect } from 'react'; 
import Swal from 'sweetalert2'; 
import './ImageUploader.css'; 

// สร้างคอมโพเนนต์ ImageUploader
function ImageUploader({ onImageChange, reset }) {
  // กำหนด state สำหรับภาพตัวอย่างและ key ของ input
  const [previewImage, setPreviewImage] = useState('/images/no-image.png'); // เริ่มต้นด้วยภาพ placeholder
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // สร้าง key สำหรับ input เพื่อช่วยในการรีเซ็ต

  // ใช้ useEffect เพื่อตรวจสอบเมื่อ reset เป็น true
  useEffect(() => {
    if (reset) {
      resetImage(); // เรียกใช้ฟังก์ชัน resetImage เพื่อรีเซ็ตค่า
    }
  }, [reset]); // ตรวจสอบการเปลี่ยนแปลงของ reset

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
      // ตรวจสอบประเภทไฟล์
      const isValidFileType = ['image/png', 'image/jpeg'].includes(file.type);
      if (!isValidFileType) {
        // แสดงข้อความผิดพลาดถ้าไฟล์ไม่ถูกต้อง
        Swal.fire({
          icon: 'error',
          title: 'ไฟล์ไม่รองรับ',
          text: 'กรุณาอัปโหลดไฟล์รูปภาพที่เป็น PNG หรือ JPG เท่านั้น',
        });
        return; // ออกจากฟังก์ชัน
      }
      // ส่งไฟล์กลับไปยังพ่อแม่
      onImageChange(file);
      const fileReader = new FileReader(); // สร้าง FileReader สำหรับอ่านไฟล์
      fileReader.onloadend = () => {
        // เมื่ออ่านไฟล์เสร็จแล้ว ตั้งค่าภาพตัวอย่าง
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL
    }
  };

  return (
    <div className="image-uploader-wrapper">  
      <div className="image-preview-container"> 
        <img src={previewImage} alt="Uploaded Preview" className="preview-image" /> 
        {previewImage !== '/images/no-image.png' && (
          // ถ้ามีภาพตัวอย่างให้แสดงปุ่มลบ
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
            id="image-upload" // ไอดีสำหรับ input
            key={fileInputKey} // ใช้ key เพื่อรีเซ็ตค่า input
            accept="image/png, image/jpeg" // กำหนดประเภทไฟล์ที่อนุญาต
            onChange={handleFileChange} // เรียกฟังก์ชันเมื่อมีการเปลี่ยนแปลง
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