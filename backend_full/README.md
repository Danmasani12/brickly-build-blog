Django backend for Realty + Gallery
----------------------------------

How to run:
1. python -m venv venv
2. source venv/bin/activate   # on Windows use venv\Scripts\activate
3. pip install -r requirements.txt
4. python manage.py makemigrations
5. python manage.py migrate
6. python manage.py createsuperuser
7. python manage.py runserver

API Endpoints:
- /api/realty/
- /api/gallery/

Admin: /admin/
Media files served at /media/ when DEBUG = True
