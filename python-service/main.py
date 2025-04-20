from flask import Flask, request, jsonify, send_file
import numpy as np
import joblib
from scipy.spatial.distance import cosine
import cv2
import os
import insightface
import boto3
from io import BytesIO
import aws_credentials
import uuid  # For generating unique filenames

app = Flask(__name__)

# Path to the clustered embeddings (without clustering now)
clustered_output_path = "clustered_embeddings.npy"

# Initialize Boto3 client to interact with S3
s3_client = boto3.client('s3', 
                         aws_access_key_id=aws_credentials.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=aws_credentials.AWS_SECRET_ACCESS_KEY,
                         region_name=aws_credentials.AWS_DEFAULT_REGION)

# S3 bucket for storing user images
user_images_bucket = "celebmaxuserimage"  

# Load the FaceAnalysis model from InsightFace
model = insightface.app.FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
model.prepare(ctx_id=-1, det_size=(224, 224))

# Load the stored embeddings with filenames
embeddings_with_filenames = np.load(clustered_output_path, allow_pickle=True)

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    user_img_path = "temp_user_image.jpg"
    file.save(user_img_path)

    img = cv2.imread(user_img_path)
    if img is None:
        return jsonify({"error": "Unable to read the image file"}), 400
    img = cv2.resize(img, (224, 224))

    try:
        faces = model.get(img)
        if not faces:
            return jsonify({"error": "No faces detected in the image, please try again!"}), 400

        if len(faces) > 1:
            return jsonify({"error": "Multiple faces detected in the image, please try again!"}), 400

        user_embedding = np.array(faces[0].normed_embedding, dtype=np.float32)
        similarity_scores = []

        for row in embeddings_with_filenames:
            img_file = row[0]
            celeb_embedding = np.array(row[1:-1], dtype=np.float32)
            distance = cosine(user_embedding, celeb_embedding)
            similarity_scores.append((img_file, distance))

        top_10_matches = sorted(similarity_scores, key=lambda x: x[1])[:10]

        # Generate a unique filename for the user's uploaded image
        unique_img_key = f"user_images/{str(uuid.uuid4())}.jpg"

        # Upload the user's image to S3 with public-read ACL
        with open(user_img_path, 'rb') as img_file:
            s3_client.put_object(
                Bucket=user_images_bucket,
                Key=unique_img_key,
                Body=img_file,
                ContentType='image/jpeg',
                ACL='public-read'  # Make the image publicly readable
            )

        # Save the user's image name into a text file
        with open("data/user_image_names.txt", "a") as f:
            f.write(f"{unique_img_key}\n")

        # Prepare the response with the image URL
        response = {
            "user_image_url": f"https://{user_images_bucket}.s3.amazonaws.com/{unique_img_key}",
            "top_matches": [
                {
                    "image": img_file,
                    "distance": float(distance),
                    "image_url": f"/celebrity_images/{img_file}"
                }
                for img_file, distance in top_10_matches
            ]
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(user_img_path):
            os.remove(user_img_path)

@app.route('/celebrity_images/<filename>', methods=['GET'])
def get_celebrity_image(filename):
    try:
        # Fetch celebrity image from S3 bucket
        s3_object = s3_client.get_object(Bucket="celebmax", Key=filename)
        img_data = s3_object['Body'].read()
        return send_file(BytesIO(img_data), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
