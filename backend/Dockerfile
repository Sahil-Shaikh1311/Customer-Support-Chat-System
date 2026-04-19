FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Daphne for Channels
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]