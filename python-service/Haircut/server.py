from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import base64
from haircut import generate_hairstyle

app = Flask(__name__)
CORS(app)

@app.route('/generate-hairstyle', methods=['POST'])
def generate_hairstyle_route():
    """
    Expects JSON with:
       {
         "faceImageUrl": "http://somewhere.com/user_face.jpg" OR base64 data,
         "celebImageUrl": "http://somewhere.com/celeb.jpg" OR base64 data
       }
    """
    data = request.get_json()
    print(">>> Received POST /generate-hairstyle with:", data)
    face_url = data.get("faceImageUrl")
    celeb_url = data.get("celebImageUrl")

    if not face_url or not celeb_url:
        return jsonify({"error": "Missing faceImageUrl or celebImageUrl"}), 400

    try:
        # This calls your fal_client code. You might need to adapt the function signature.
        # The function presumably returns some result object or maybe a base64 image string.
        result = generate_hairstyle(face_url, celeb_url)
        
        # 'result' might be a dictionary from fal_client, or an object with more info.
        # You’ll need to parse what comes back from 'result'.
        # For example, if the model returns a single image URL or base64, you do this:
        if "result_image_url" in result:
            # Return that image URL
            return jsonify({"hairstyleUrl": result["result_image_url"]})
        elif "result_base64" in result:
            return jsonify({"hairstyleBase64": result["result_base64"]})
        else:
            return jsonify({"error": "Unexpected result structure"}), 500

    except Exception as e:
        print(f"Error generating hairstyle: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False, use_reloader=False)
