import fal_client
import os
from API_KEY import API_KEY
import traceback
os.environ["FAL_KEY"] = API_KEY

def on_queue_update(update):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print(log["message"])

def generate_hairstyle(img1, img2):
    try:
        result = fal_client.subscribe(
            "fal-ai/hair-fast-gan",
            arguments={
                "face_image_url": img1,
                "shape_image_url": img2,
                "color_image_url": img2
            },
            with_logs=True,
            on_queue_update=on_queue_update
        )

        generated_url = result["output"]["image_url"]
        
        # Return a dictionary that the Flask route can parse
        return {"result_image_url": generated_url}
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        # re-raise or return an error structure
        raise e
