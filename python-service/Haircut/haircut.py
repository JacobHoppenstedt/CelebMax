import fal_client
import os
from API_KEY import API_KEY
os.environ["FAL_KEY"] = API_KEY

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(log["message"])

try:
    result = fal_client.subscribe(
        "fal-ai/hair-fast-gan",
        arguments={
            "face_image_url": "https://storage.googleapis.com/falserverless/model_tests/fasthairgan/tom_cruise.png",
            "shape_image_url": "https://storage.googleapis.com/falserverless/model_tests/fasthairgan/zend.jpeg",
            "color_image_url": "https://storage.googleapis.com/falserverless/model_tests/fasthairgan/trendy-haircut-2023.png"
        },
        with_logs=True,
        on_queue_update=on_queue_update
    )
    print(result)
except Exception as e:
    print(f"Error: {e}")