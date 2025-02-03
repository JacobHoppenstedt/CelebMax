from flask import Flask, request, jsonify
import numpy as np
import joblib
from deepface import DeepFace
from scipy.spatial.distance import cosine
from PIL import Image
import os

app = Flask(__name__)

# Paths to the model and data files
kmeans_model_file = "kmeans_model.pkl"
clustered_output_path = "clustered_embeddings.npy"
celebrity_dir = "Celebrity_Faces_Dataset"

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

    try:
        # Generate embedding for the user's image using DeepFace
        user_embedding = DeepFace.represent(img_path=user_img_path, model_name="ArcFace")[0]['embedding']
        user_embedding = np.array(user_embedding, dtype=np.float32)

        # Predict the cluster for the user's image using the KMeans model
        user_cluster = kmeans.predict(user_embedding.reshape(1, -1))[0]

        # Filter embeddings to only those in the same cluster as the user's image
        clustered_embeddings = [
            row for row in clustered_embeddings_with_filenames if int(row[-1]) == user_cluster
        ]

        # Calculate similarity scores (cosine distance) between the user's embedding and celebrity embeddings
        similarity_scores = []
        for row in clustered_embeddings:
            img_file, *celeb_embedding, cluster_id = row  # Extract filename, embedding, and cluster
            celeb_embedding = np.array(celeb_embedding)
            distance = cosine(user_embedding, celeb_embedding)  # Compute cosine distance
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

# Endpoint to serve celebrity images
@app.route('/celebrity_images/<filename>', methods=['GET'])
def get_celebrity_image(filename):
    try:
        # Construct the full path to the celebrity image
        image_path = os.path.join(celebrity_dir, filename)
        if not os.path.exists(image_path):
            return jsonify({"error": "Image not found"}), 404

        # Return the image file
        return app.send_file(image_path, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000)