import os, traceback, base64, requests
import fal_client
import numpy as np
import cv2
from io import BytesIO
from API_KEY import API_KEY

os.environ["FAL_KEY"] = API_KEY

def on_queue_update(update, *_):
    if isinstance(update, fal_client.InProgress):
        for log in update.logs:
            print("  Fal.ai log:", log["message"])

def fetch_and_resize_to_datauri(url, size=(1024, 1024)):
    # 1) Fetch
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()

    # 2) Decode image bytes into OpenCV array
    arr = np.frombuffer(resp.content, np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Could not decode image from {url}")

    # 3) Resize to exactly 1024×1024
    resized = cv2.resize(img, size, interpolation=cv2.INTER_CUBIC)

    # 4) Re‑encode to PNG in memory
    success, buf = cv2.imencode('.jpg', resized, [int(cv2.IMWRITE_JPEG_QUALITY), 50])
    if not success:
        raise RuntimeError("Failed to encode resized image to PNG")

    # 5) Base64‑ify
    b64 = base64.b64encode(buf).decode('utf-8')
    return f"data:image/png;base64,{b64}"

def generate_hairstyle(face_url, celeb_url):
    try:
        # turn both URLs into big 1024×1024 data URIs
        face_datauri = fetch_and_resize_to_datauri(face_url)
        celeb_datauri = fetch_and_resize_to_datauri(celeb_url)

        payload = {
            "face_image_url": face_datauri,
            "shape_image_url": celeb_datauri,
            "color_image_url": celeb_datauri
        }
        print(">>> Fal.ai payload keys & lengths:",
              {k: len(v) for k, v in payload.items()})

        # call the model
        result = fal_client.subscribe(
            "fal-ai/hair-fast-gan",
            arguments=payload,
            with_logs=True,
            on_queue_update=on_queue_update
        )
        print(">>> Fal.ai raw result:", result)

        if "image" in result and "url" in result["image"]:
            img_url = result["image"]["url"]
        # fallback if it ever changes
        elif "output" in result and "image_url" in result["output"]:
            img_url = result["output"]["image_url"]
        else:
            raise RuntimeError(f"Couldn't find image url in Fal.ai response: {result!r}")

        return {"result_image_url": img_url}

    except Exception as e:
        print(">> Exception calling fal.ai:")
        traceback.print_exc()

        if hasattr(e, "response") and e.response is not None:
            try:
                print(">>> Fal.ai error response body:", e.response.text)
            except:
                pass
        raise