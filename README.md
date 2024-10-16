**Backend Django**

**ขั้นตอนการติดตั้ง**
- python -m venv
- \venv\Scripts\activate
- django-admin startproject ProjectSIDev
- python manage.py startapp prodocts
- python manage.py migrate
- python manage.py runserver


**โหลดเพิ่มเติม**

การเชื่อมต่อ Django กับ MongoDB โดยใช้ pymongo
**- pip install pymongo**

การเชื่อมต่อ Django กับ React มีขั้นตอน
1. ติดตั้ง Django REST Framework:
   **- pip install djangorestframework**

2. ตั้งค่าให้ Django อนุญาตการเข้าถึงจากแหล่งที่มาภายนอก ติดตั้ง django-cors-headers:
   **- pip install django-cors-headers**
