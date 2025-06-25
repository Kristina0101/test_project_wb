import requests

from test_project.models import Product


def fetch_products_from_wb(search_query):
    url = f"https://search.wb.ru/exactmatch/ru/common/v4/search"
    params = {
        "query": search_query,
        "appType": 1,
        "curr": "rub",
        "dest": -1257786,
        "regions": "80,64,83,4,38,33,68,70,30,40,86,69,1,66,22,31,48,71,110,114",
        "spp": 30,
        "resultset": "catalog",
        "sort": "popular",
        "page": 1,
        "limit": 100
    }
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        response = requests.get(url, headers=headers, params = params)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Ошибка при запросе к API: {e}")
        return []
    
    products = []
    for item in data.get("data", {}).get("products", []):
        product = Product(
            name = item.get("name", "Без названия"),
            price = item.get("priceU", 0) / 100 if item.get("salePriceU") else None,
            sale_price=(item.get("salePriceU", 0) or None) / 100 if item.get("salePriceU") else None,
            rating = item.get("reviewRating", 0),
            reviews_count = item.get("feedbacks", 0),
        )

        products.append(product)
    
    Product.objects.bulk_create(products)
    print(f"Сохранено {len(products)} товаров")
    return products