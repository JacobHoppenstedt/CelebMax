import os
import cv2
import shutil
from mtcnn import MTCNN
from tqdm import tqdm
from deepface import DeepFace  # Second AI to verify faces

# Define input and output folders
input_folder = "path/to/your/images"
output_folder = "path/to/save/cropped_faces"
backup_folder = "path/to/save/backup_faces"  # Backup original images

# Create necessary folders if they don't exist
os.makedirs(output_folder, exist_ok=True)
os.makedirs(backup_folder, exist_ok=True)

# Initialize face detector
detector = MTCNN()

# Get list of image files
image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

# Process each image with a progress bar
for filename in tqdm(image_files, desc="Processing Images"):
    img_path = os.path.join(input_folder, filename)
    
    # Read image
    image = cv2.imread(img_path)
    if image is None:
        continue  # Skip if the image cannot be loaded

    height, width, _ = image.shape  # Get image dimensions

    # Detect faces
    faces = detector.detect_faces(image)

    if faces:  # If at least one face is detected
        for face in faces:
            x, y, w, h = face["box"]

            # Expand the bounding box to include hair and ears
            expansion_ratio = 0.4  # Increase box size by 40% around
            x_new = max(0, x - int(w * expansion_ratio))
            y_new = max(0, y - int(h * expansion_ratio))
            w_new = min(width - x_new, int(w * (1 + 2 * expansion_ratio)))
            h_new = min(height - y_new, int(h * (1 + 2 * expansion_ratio)))

            # Crop the expanded region
            cropped_face = image[y_new:y_new+h_new, x_new:x_new+w_new]

            # Resize to a standard size (optional)
            cropped_face = cv2.resize(cropped_face, (224, 224))

            # Save cropped face
            save_path = os.path.join(output_folder, filename)
            cv2.imwrite(save_path, cropped_face)

            # Backup original image
            shutil.copy(img_path, os.path.join(backup_folder, filename))

    else:
        # Delete the image if no face is detected
        os.remove(img_path)

print("Face cropping completed. Now verifying images...")

# Step 2: Verify cropped images using DeepFace
for filename in tqdm(os.listdir(output_folder), desc="Verifying Cropped Faces"):
    cropped_path = os.path.join(output_folder, filename)

    try:
        # Verify if the cropped image contains a face
        DeepFace.extract_faces(cropped_path, detector_backend="mtcnn")
    
    except:
        # If verification fails, delete cropped image and restore original
        print(f"Bad crop detected: {filename}. Restoring original.")
        os.remove(cropped_path)
        shutil.copy(os.path.join(backup_folder, filename), os.path.join(output_folder, filename))

print("Verification complete. Final dataset is ready!")