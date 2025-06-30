from django.core.management.base import BaseCommand
from test_project.wb_parser import fetch_products_from_wb

class Command(BaseCommand):
    help = "Сохраняет товары с WB в базу данных"

    def handle(self, *args, **options):
        result = fetch_products_from_wb("клавиатура")
        self.stdout.write(self.style.SUCCESS(f"Успешно сохранено {len(result)} товаров"))