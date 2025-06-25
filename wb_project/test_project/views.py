from django.shortcuts import render
from rest_framework import generics

from test_project.models import Product
from test_project.serializers import ProductSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.core.paginator import Paginator
from django.views.generic import ListView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Min, Max, Count, Case, When, IntegerField


# Create your views here.

def index(request):
    return render(request, 'test_project/index.html')

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'price': ['gte', 'lte'],
        'rating': ['gte'],
        'reviews_count': ['gte'],
    }

class ProductList(ListView):
    model = Product
    template_name = 'test_project/index.html'
    context_object_name = 'ProductList'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset()
        
        price_min = self.request.GET.get('price_min')
        price_max = self.request.GET.get('price_max')
        rating_min = self.request.GET.get('rating_min')
        reviews_min = self.request.GET.get('reviews_min')
        
        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)
        if rating_min:
            queryset = queryset.filter(rating__gte=rating_min)
        if reviews_min:
            queryset = queryset.filter(reviews_count__gte=reviews_min)

        sort_by = self.request.GET.get('sort_by')
        sort_order = self.request.GET.get('sort_order', 'asc')

        if sort_by:
            if sort_order == 'desc':
                sort_by = f'-{sort_by}'
            queryset = queryset.order_by(sort_by)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        original_queryset = self.get_queryset()
        paginator = Paginator(original_queryset, self.paginate_by)
        page = self.request.GET.get('page')
        ProductList = paginator.get_page(page)
        context['ProductList'] = ProductList
    
        price_range = Product.objects.aggregate(
            min_price=Min('price'),
            max_price=Max('price')
        )
        rating_range = Product.objects.aggregate(
            min_rating=Min('rating'),
            max_rating=Max('rating')
        )
        reviews_range = Product.objects.aggregate(
            min_reviews=Min('reviews_count'),
            max_reviews=Max('reviews_count')
        )

        context['min_price'] = price_range['min_price'] if price_range['min_price'] is not None else 0
        context['max_price'] = price_range['max_price'] if price_range['max_price'] is not None else 10000
        context['min_rating'] = rating_range['min_rating'] if rating_range['min_rating'] is not None else 0
        context['max_rating'] = rating_range['max_rating'] if rating_range['max_rating'] is not None else 5
        context['min_reviews'] = reviews_range['min_reviews'] if reviews_range['min_reviews'] is not None else 0
        context['max_reviews'] = reviews_range['max_reviews'] if reviews_range['max_reviews'] is not None else 10000

        return context

@api_view(['GET'])
def price_histogram(request):
    price_ranges = [
        (0, 1000),
        (1001, 2000),
        (2001, 3000),
        (3001, 4000),
        (4001, 5000),
        (5001, 10000)
    ]

    queryset = Product.objects.all()
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    rating_min = request.GET.get('rating_min')
    reviews_min = request.GET.get('reviews_min')

    if price_min:
        queryset = queryset.filter(price__gte=price_min)
    if price_max:
        queryset = queryset.filter(price__lte=price_max)
    if rating_min:
        queryset = queryset.filter(rating__gte=rating_min)
    if reviews_min:
        queryset = queryset.filter(reviews_count__gte=reviews_min)

    cases = []
    for i, (min_price, max_price) in enumerate(price_ranges):
        cases.append(When(price__gte=min_price, price__lte=max_price, then=i + 1))

    result = queryset.annotate(
        range_flag=Case(*cases, output_field=IntegerField())
    ).values('range_flag').annotate(count=Count('id')).order_by('range_flag')

    formatted_result = []
    for i, (min_price, max_price) in enumerate(price_ranges):
        count = 0
        for item in result:
            if item['range_flag'] == i + 1:
                count = item['count']
                break
        formatted_result.append({
            'range': f"{min_price}-{max_price}",
            'count': count
        })

    return Response(formatted_result)

@api_view(['GET'])
def product_list_api(request):
    queryset = Product.objects.all()
    
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    rating_min = request.GET.get('rating_min')
    reviews_min = request.GET.get('reviews_min')
    
    if price_min:
        queryset = queryset.filter(price__gte=price_min)
    if price_max:
        queryset = queryset.filter(price__lte=price_max)
    if rating_min:
        queryset = queryset.filter(rating__gte=rating_min)
    if reviews_min:
        queryset = queryset.filter(reviews_count__gte=reviews_min)

    sort_by = request.GET.get('sort_by')
    sort_order = request.GET.get('sort_order', 'asc')

    if sort_by:
        if sort_order == 'desc':
            sort_by = f'-{sort_by}'
        queryset = queryset.order_by(sort_by)

    serializer = ProductSerializer(queryset, many=True)
    return Response(serializer.data)