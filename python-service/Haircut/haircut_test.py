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
            "face_image_url": "https://celebmaxuserimage.s3.amazonaws.com/user_images/23cc40f9-47e1-41c6-ad17-bf2a90a67fae.jpg",
            "shape_image_url": "https://celebmax.s3.us-east-2.amazonaws.com/Penny_Marshall.png",
            "color_image_url": "https://celebmax.s3.us-east-2.amazonaws.com/Penny_Marshall.png"
        },
        with_logs=True,
        on_queue_update=on_queue_update
    )
    print(result)
except Exception as e:
    print(f"Error: {e}")