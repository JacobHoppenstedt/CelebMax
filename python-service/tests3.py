import os
import requests
from io import BytesIO
from PIL import Image
import boto3
import aws_credentials

# Define the base URL for your Flask app
BASE_URL = 'http://127.0.0.1:5001'

# Initialize Boto3 client to interact with S3
s3_client = boto3.client('s3', 
                         aws_access_key_id=aws_credentials.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=aws_credentials.AWS_SECRET_ACCESS_KEY,
                         region_name=aws_credentials.AWS_DEFAULT_REGION)

# Function to test the /predict endpoint
def test_predict(image_path):
    with open(image_path, 'rb') as img_file:
        # Send a POST request with the image file
        response = requests.post(f'{BASE_URL}/predict', files={'image': img_file})

    # Check if the response is successful
    if response.status_code == 200:
        result = response.json()
        print("Prediction response:", result)
        
        # Get the top matches and image names
        top_matches = result.get('top_matches', [])
        for match in top_matches:
            image_name = match['image']
            print(f"Top match: {image_name}, Distance: {match['distance']}")
            fetch_image_from_s3(image_name)  # Fetch and show the images from S3
    else:
        print("Error in prediction:", response.json())

# Function to fetch the celebrity image from S3 based on the image filename
def fetch_image_from_s3(filename):
    try:
        # Fetch the celebrity image from S3 using Boto3
        s3_object = s3_client.get_object(Bucket="celebmax", Key=filename)
        
        # Read the image data from S3
        img_data = s3_object['Body'].read()

        # Display the image
        img = Image.open(BytesIO(img_data))
        img.show()  # This will open the image in the default image viewer
        print(f"Successfully fetched and displayed image: {filename}")
        
    except Exception as e:
        print(f"Error fetching image {filename}: {str(e)}")

if __name__ == '__main__':
    # Test the /predict route with a sample image
    test_image_path = '/Users/veerajtalasani/Desktop/50_Cent.png'  # Change this to your test image file path
    test_predict(test_image_path)
