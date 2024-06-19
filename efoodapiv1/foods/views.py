from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from foods.models import *
from foods import serializers, paginators, perms
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import cloudinary.uploader
from django.shortcuts import get_object_or_404


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class StoreViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Store.objects.filter(active=True)
    serializer_class = serializers.StoreSerializer
    pagination_class = paginators.StorePaginator

    def get_queryset(self):
        queryset = self.queryset

        if self.action == 'list':
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)

            cate_id = self.request.query_params.get('categories_id')
            if cate_id:
                queryset = queryset.filter(categories_id=cate_id)

        return queryset

    @action(methods=['get'], url_path='menu_items', detail=True)
    def get_menu_items(self, request, pk):
        menu_items = self.get_object().menuitem_set.filter(active=True)

        q = request.query_params.get('q')
        if q:
            menu_items = menu_items.filter(subject__icontains=q)

        return Response(serializers.MenuItemSerializer(menu_items, many=True).data,
                        status=status.HTTP_200_OK)


class MenuItemViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = MenuItem.objects.prefetch_related('tags').filter(active=True)
    serializer_class = serializers.MenuItemDetailSerializer

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.AuthenticatedMenuItemDetailSerializer

        return self.serializer_class

    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().comment_set.select_related('user').all()
        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentSerializer(comments, many=True).data
                        , status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        c = self.get_object().comments.create(content=request.data.get('content'),
                                              user=request.user)
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = LikeMenuItem.objects.get_or_create(menu_item=self.get_object(),
                                                         user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.MenuItemSerializer(self.get_object()).data)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_permissions(self):
        if self.action in ['current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    @action(detail=False, methods=['patch'], url_path='update_password', url_name='change_password')
    def update_password(self, request):
        user = get_object_or_404(User, id=request.user.id)
        old_password = request.data.get('old_password', None)
        new_password = request.data.get('new_password', None)
        print(user)
        if not old_password or not new_password:
            return Response({'detail': 'Missing required fields'}, status=status.HTTP_400_BAD_REQUEST)

        if user.check_password(old_password):
            user.set_password(new_password)
            user.is_first_login = False
            user.save()
            return Response({'detail': 'Password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid old password'}, status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommnetOwner]


class AccountViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.AccountInfoSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @action(detail=True, methods=['patch'], url_path='upload_avatar', url_name='upload_avatar')
    def upload_avatar(self, request, pk):
        user = get_object_or_404(User, id=pk)
        avatar_file = request.data.get('avatar', None)
        try:
            new_avatar = cloudinary.uploader.upload(avatar_file)
            user.avatar = new_avatar['secure_url']
            user.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], url_path='update_infor', url_name='update_infor')
    def update_infor(self, request, pk):
        user = get_object_or_404(User, id=pk)

        try:
            first_name = request.data.get('first_name', None)
            last_name = request.data.get('last_name', None)
            email = request.data.get('email', None)
            if first_name:
                user.first_name = first_name
            if last_name:
                user.last_name = last_name
            if email:
                user.email = email

            user.save()
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_200_OK)


import logging

logger = logging.getLogger(__name__)


class OrderViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = serializers.OrderSerializer
    queryset = Order.objects.all()

    @action(detail=False, methods=['post'], url_path='create_orders', url_name='create_orders')
    def create_orders(self, request):
        user_id = request.data.get('user')
        store_id = request.data.get('store')
        menu_items = request.data.get('menu_items')  # List các menu item được chọn
        total_price = request.data.get('total_price')
        delivery_fee = request.data.get('delivery_fee')
        payment_method = request.data.get('payment_method')
        status_orders = request.data.get('status')

        store = get_object_or_404(Store, id=store_id)
        user = get_object_or_404(User, id=user_id)

        order = Order.objects.create(
            user_id=user.id,
            store_id=store.id,
            total_price=total_price,
            delivery_fee=delivery_fee,
            payment_method=payment_method,
            status=status_orders  # Trạng thái mặc định khi tạo order là pending
        )

        order_items = []
        for item_data in menu_items:
            menu_item_id = item_data.get('menu_item')
            quantity = item_data.get('quantity')
            # Tạo OrderItem và thêm vào order_items
            order_item = OrderItem.objects.create(
                menu_item_id=menu_item_id,
                quantity=quantity,
                order_id=order.id  # Gán order cho OrderItem ngay khi tạo
            )
            order_items.append(order_item)
        return Response(serializers.OrderSerializer(order).data, status=status.HTTP_201_CREATED)


#MOMO
import uuid
import hmac
import hashlib
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework import viewsets
from .models import Order


class MomoViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'], url_path='process_payment', url_name='process_payment')
    @csrf_exempt
    def process_payment(self, request):
        if request.method == 'POST':
            try:
                payment_data = request.data
                amount = payment_data.get('amount')
                order_id = payment_data.get('order_id')
                amount = int(amount)

                try:
                    order = Order.objects.get(id=order_id)
                    print(order)
                except Order.DoesNotExist:
                    return JsonResponse({'error': 'Order not found'}, status=404)

                expected_amount = order.total_price+order.delivery_fee
                if amount != expected_amount:
                    return JsonResponse({'error': 'Amount does not match'}, status=400)

                momo_order_id = str(uuid.uuid4())
                request_id = str(uuid.uuid4())

                endpoint = "https://test-payment.momo.vn/v2/gateway/api/create"
                access_key = "F8BBA842ECF85"
                secret_key = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
                order_info = str(order_id)
                redirect_url = "http://172.20.10.3:8001/payment/success"  # Update this with your redirect URL
                ipn_url = "https://yourdomain.com/api/momo/momo_ipn/"

                raw_signature = f"accessKey={access_key}&amount={amount}&extraData=&ipnUrl={ipn_url}&orderId={momo_order_id}&orderInfo={order_info}&partnerCode=MOMO&redirectUrl={redirect_url}&requestId={request_id}&requestType=captureWallet"
                h = hmac.new(bytes(secret_key, 'ascii'), bytes(raw_signature, 'ascii'), hashlib.sha256)
                signature = h.hexdigest()

                data = {
                    'partnerCode': 'MOMO',
                    'partnerName': 'Test',
                    'storeId': 'MomoTestStore',
                    'requestId': request_id,
                    'amount': str(amount),
                    'orderId': momo_order_id,
                    'orderInfo': order_info,
                    'redirectUrl': redirect_url,
                    'ipnUrl': ipn_url,
                    'lang': 'vi',
                    'extraData': '',
                    'requestType': 'captureWallet',
                    'signature': signature
                }

                response = requests.post(endpoint, json=data)

                if response.status_code == 200:
                    response_data = response.json()
                    if 'payUrl' in response_data:
                        return JsonResponse({'payUrl': response_data['payUrl']})
                    else:
                        return JsonResponse({'error': 'Failed to process payment'}, status=400)
                else:
                    return JsonResponse({'error': 'Failed to communicate with MoMo'}, status=500)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

    @action(detail=False, methods=['post'], url_path='momo_ipn')
    @csrf_exempt
    def momo_ipn(self, request):
        if request.method == 'POST':
            try:
                ipn_data = request.data
                order_info = ipn_data.get('orderInfo')
                result_code = ipn_data.get('resultCode')

                if result_code == 0:
                    try:
                        order = Order.objects.get(id=order_info)
                        order.status = 'confirmed'  # Update this based on your Order model's status field
                        order.save()
                        return JsonResponse({'message': 'Payment successful and status updated'}, status=200)
                    except Order.DoesNotExist:
                        return JsonResponse({'error': 'Order not found'}, status=404)
                else:
                    return JsonResponse({'error': 'Payment failed'}, status=400)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

