import os
from PIL import Image

FOLDER_PATH = "celebrity_images"  # The folder with all images
TARGET_SIZE = 512                 # final dimension (512x512)

def center_crop_and_resize(img, size=512):
    """
    Center-crop an image to a square, then resize to (size, size).
    Used to save on space as original file was ~25 gigs D:
    """
    width, height = img.size

    # 1) Figure out the shortest side
    shortest_side = min(width, height)

    # 2) Calculate left, top, right, bottom for center crop
    left = (width - shortest_side) // 2
    top = (height - shortest_side) // 2
    right = left + shortest_side
    bottom = top + shortest_side
    
    # 3) Crop to square
    img_cropped = img.crop((left, top, right, bottom))

    # 4) Resize to final dimension (512x512)
    img_resized = img_cropped.resize((size, size), Image.Resampling.LANCZOS)
    return img_resized


def main():
    exts = {".png"}

    all_files = os.listdir(FOLDER_PATH)
    image_files = [f for f in all_files if os.path.splitext(f)[1].lower() in exts]

    print(f"Found {len(image_files)} image files in '{FOLDER_PATH}'")

    for idx, filename in enumerate(image_files, 1):
        file_path = os.path.join(FOLDER_PATH, filename)
        try:
            with Image.open(file_path) as img:
                # Convert to RGB in case of palette or RGBA
                img = img.convert("RGB")
                
                # Center-crop + resize
                img_512 = center_crop_and_resize(img, TARGET_SIZE)

                # Overwrite original file
                img_512.save(file_path, "JPEG", quality=85)
        except Exception as e:
            print(f"Error processing '{filename}': {e}")
            continue
        
        if idx % 500 == 0:
            print(f"Processed {idx} images so far...")

    print("Done resizing all images to 512x512 in place.")

if __name__ == "__main__":
    main()
