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

app = Flask(__name__)

# Paths to the model and data files
kmeans_model_file = "kmeans_model.pkl"
clustered_output_path = "clustered_embeddings.npy"
 





# Initialize Boto3 client to interact with S3
s3_client = boto3.client('s3', 
                         aws_access_key_id=aws_credentials.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=aws_credentials.AWS_SECRET_ACCESS_KEY,
                         region_name=aws_credentials.AWS_DEFAULT_REGION)


# Load the FaceAnalysis model from InsightFace
model = insightface.app.FaceAnalysis(name="buffalo_l", providers=['CPUExecutionProvider'])
model.prepare(ctx_id=-1, det_size=(224, 224))

# Load the KMeans model and clustered embeddings
kmeans = joblib.load(kmeans_model_file)
clustered_embeddings_with_filenames = np.load(clustered_output_path, allow_pickle=True)

@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image file is provided in the request
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    # Save the uploaded image temporarily
    file = request.files['image']
    user_img_path = "temp_user_image.jpg"
    file.save(user_img_path)

    img = cv2.imread(user_img_path)
    if img is None:
        return jsonify({"error": "Unable to read the image file"}), 400
    img = cv2.resize(img, (224, 224))

    try:
        # Generate embedding for the user's image using DeepFace
        faces = model.get(img)
        if not faces:
            return jsonify({"error": "No faces detected in the image, please try again!"}), 400

        # Check if multiple faces are detected and use the first one
        if len(faces) > 1:
            return jsonify({"error": "Multiple faces detected in the image, please try again!"}), 400

        user_embedding = faces[0].normed_embedding  # Get the embedding
        user_embedding = np.array(user_embedding, dtype=np.float32)
        user_cluster = kmeans.predict(user_embedding.reshape(1, -1))[0]
        similarity_scores = []
        
        for row in clustered_embeddings_with_filenames:  # Iterate through all images
            img_file, *celeb_embedding, cluster_id = row  # Extract filename, embedding, and cluster
            celeb_embedding = np.array(celeb_embedding, dtype=np.float32)  # Ensure correct dtype
    
            distance = cosine(user_embedding, celeb_embedding)  # Compute cosine similarity
            similarity_scores.append((img_file, distance))

        # Sort by distance and get the top 10 matches
        top_10_matches = sorted(similarity_scores, key=lambda x: x[1])[:10]

        # Prepare the response
        response = {
            "user_cluster": int(user_cluster),
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
        # Clean up: Delete the temporary user image file
        if os.path.exists(user_img_path):
            os.remove(user_img_path)

# Endpoint to serve celebrity images from S3
@app.route('/celebrity_images/<filename>', methods=['GET'])
def get_celebrity_image(filename):
    try:
        # Fetch the celebrity image from S3 using Boto3
        s3_object = s3_client.get_object(Bucket="celebmax", Key=filename)
        
        # Read the image data from S3
        img_data = s3_object['Body'].read()

        # Return the image directly as a response with the correct MIME type
        return send_file(BytesIO(img_data), mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001)

