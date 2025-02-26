FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "main.py"]

# run these in \python-service
# docker build -t celeb-py-service .
# docker run -p 5000:5000 celeb-py-service
