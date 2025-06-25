from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'test_project'
urlpatterns = [
    path('', views.ProductList.as_view(), name='ProductList'),
    path('api/products/', views.ProductListView.as_view()),
    path('api/products/histogram/', views.price_histogram, name='price-histogram'),
    path('api/products/grafics_histogram/', views.product_list_api, name='product-list-api'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)