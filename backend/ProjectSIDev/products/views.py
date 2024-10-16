from django.conf import settings
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
from bson import ObjectId
from db_connection import products_collection

class ProductViewSet(viewsets.ViewSet):
    # ดึงข้อมูลสินค้าทั้งหมด
    def list(self, request):
        try:
            products = list(products_collection.find())
            for product in products:
                product['_id'] = str(product['_id'])  # แปลง ObjectId เป็น string
            return Response(products, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # เพิ่มสินค้าลงใน MongoDB
    def create(self, request):
        try:
            data = request.data
            files = request.FILES

            # สร้างข้อมูลสินค้าใหม่
            product = {
                'name': data.get('name'),
                'description': data.get('description', ''),
                'category': data.get('category', ''),
                'price': int(data.get('price', 0)),
                'colors': json.loads(data.get('colors', '[]')),
                'sizes': json.loads(data.get('sizes', '[]')),
            }
            # จัดการไฟล์ภาพ
            if 'image' in files:
                image = files['image']
                if image.content_type.startswith('image/'):
                    image_path = default_storage.save(f'images/{image.name}', ContentFile(image.read()))
                    image_url = f'{settings.MEDIA_URL}{image_path}'
                    product['image'] = image_url
                else:
                    return Response({'error': 'Invalid file type for image'}, status=status.HTTP_400_BAD_REQUEST)

            # แทรกข้อมูลลง MongoDB
            result = products_collection.insert_one(product)

            return Response({'message': 'Product added successfully', 'id': str(result.inserted_id)},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ดึงข้อมูลสินค้าตาม ID
    def retrieve(self, request, pk=None):
        try:
            product = products_collection.find_one({'_id': ObjectId(pk)})
            if product:
                product['_id'] = str(product['_id'])  # แปลง ObjectId เป็น string
                return Response(product, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # แก้ไขข้อมูลสินค้าบางส่วนด้วย ID (patch)
    def partial_update(self, request, pk=None):
        try:
            data = request.data
            files = request.FILES

            # เตรียมข้อมูลที่ต้องการแก้ไขเฉพาะฟิลด์ที่ได้รับ
            update_data = {}
            if 'name' in data:
                update_data['name'] = data.get('name')
            if 'description' in data:
                update_data['description'] = data.get('description', '')
            if 'category' in data:
                update_data['category'] = data.get('category', '')
            if 'price' in data:
                update_data['price'] = int(data.get('price'))
            if 'colors' in data:
                update_data['colors'] = json.loads(data.get('colors', '[]'))
            if 'sizes' in data:
                update_data['sizes'] = json.loads(data.get('sizes', '[]'))
            print(update_data)

            # จัดการไฟล์ภาพถ้ามีการเปลี่ยน
            if 'image' in files:
                image = files['image']
                if image.content_type.startswith('image/'):
                    image_path = default_storage.save(f'images/{image.name}', ContentFile(image.read()))
                    image_url = f'{settings.MEDIA_URL}{image_path}'
                    update_data['image'] = image_url
                else:
                    return Response({'error': 'Invalid file type for image'}, status=status.HTTP_400_BAD_REQUEST)

            # อัพเดทข้อมูลใน MongoDB เฉพาะฟิลด์ที่ต้องการแก้ไข
            result = products_collection.update_one({'_id': ObjectId(pk)}, {'$set': update_data})

            if result.modified_count > 0:
                return Response({'message': 'Product updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'No changes made or product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # ลบสินค้าด้วย ID
    def destroy(self, request, pk=None):
        try:
            result = products_collection.delete_one({'_id': ObjectId(pk)})

            if result.deleted_count == 1:
                return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # แก้ไขข้อมูลสินค้าด้วย ID (PUT)
    def update(self, request, pk=None):
        try:
            data = request.data
            files = request.FILES

            # เตรียมข้อมูลสินค้าใหม่จากข้อมูลที่ได้รับ
            product = {
                'name': data.get('name'),
                'description': data.get('description', ''),
                'category': data.get('category', ''),
                'price': int(data.get('price', 0)),
                'colors': json.loads(data.get('colors', '[]')),
                'sizes': json.loads(data.get('sizes', '[]')),
            }

            # จัดการไฟล์ภาพถ้ามีการส่งเข้ามา
            if 'image' in files:
                image = files['image']
                if image.content_type.startswith('image/'):
                    image_path = default_storage.save(f'images/{image.name}', ContentFile(image.read()))
                    image_url = f'{settings.MEDIA_URL}{image_path}'
                    product['image'] = image_url
                else:
                    return Response({'error': 'Invalid file type for image'}, status=status.HTTP_400_BAD_REQUEST)

            # อัพเดทข้อมูลใน MongoDB โดยการแทนที่ข้อมูลทั้งหมด
            result = products_collection.replace_one({'_id': ObjectId(pk)}, product)

            if result.matched_count > 0:
                return Response({'message': 'Product updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
