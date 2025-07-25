# test_project_wb
Создан простой сервис аналитики товаров с визуализацией данных на фронтенде.
</br>Выполнено (исходя из ТЗ):
</br>Часть 1: Backend
</br>Парсер данных: 
- Скрипт для парсинга данных о товарах с сайта Wildberries;
- Поля: название товара, цена, цена со скидкой, рейтинг, количество отзывов;
- Сохранение данных в бд.
</br>API-эндпоинт:
- Создан эндпоинт /api/products/ с поддержкой фильтрации: по цене, рейтингу, количеству отзывов.

</br>Часть 2: Frontend
1. Создана таблица с колонками: "Название товара", "Цена", "Цена со скидкой", "Рейтинг", "Количество отзывов";

2. Функционал таблицы:
</br>Фильтры:
- Слайдер для диапазона цен;
- Фильтр по минимальному рейтингу;
- Фильтр по минимальному количеству отзывов.
</br>Сортировка:
- По возрастанию/убыванию рейтинга, количеству отзывов, цене, названию;
- Динамическое обновление: при изменении фильтров таблица перерисовывается с учетом новых данных.

3. Диаграммы:
</br>Созданы графики, которые обновляются при изменении фильтров:
</br>Гистограмма цен: распределение цены vs количество товаров;
</br>Линейный график: размер скидки на товар vs рейтинг товара.


<h1>Для запуска проекта необходимо выполнить следующие шаги:</h1>
<ul>
<li>Установить виртуальное окружение с помощью команды: python -m venv env </li>
<li>Активировать виртуальное окружение с помощью команды: .\env\Scripts\activate </li>
<li>Для запуска проекта необходимо перейти в папку "wb_project" и ввести команду: pip install -r requirements.txt</li>
<li>Далее нужно ввести команду: python manage.py migrate</li>
<li>Далее нужно ввести команду: python manage.py makemigration</li>
<li>Для отображения данных в таблице необходимо импортировать данные из API. Код для импорта есть в папке management "parse_wb.py". В терминале нужно ввести команду: python manage.py parse_wb</li>
<li>И запускаем проект: python manage.py runserver</li>
</ul>