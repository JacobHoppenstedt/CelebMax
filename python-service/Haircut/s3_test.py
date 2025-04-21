import unittest
from flask import Flask, jsonify
from flask_testing import TestCase
from unittest.mock import patch
import json

class TestS3Functionality(TestCase):

    def create_app(self):
        # Set up Flask app for testing
        app = Flask(__name__)
        # Register routes, mock or patch external services here
        from server import app as app_module  # Adjust the import based on your file structure
        return app_module

    @patch('server.generate_hairstyle')  # Mock the generate_hairstyle function
    def test_generate_hairstyle_success(self, mock_generate_hairstyle):
        # Mock the return value from the generate_hairstyle function
        mock_generate_hairstyle.return_value = {"result_image_url": "http://somewhere.com/generated_hairstyle.jpg"}
        
        # Create the test data for the POST request
        data = {
            "faceImageUrl": "http://somewhere.com/user_face.jpg",
            "celebImageUrl": "http://somewhere.com/celeb.jpg"
        }

        # Make the POST request to the /generate-hairstyle endpoint
        response = self.client.post('/generate-hairstyle', data=json.dumps(data), content_type='application/json')

        # Check if the response status code is 200 (OK)
        self.assertEqual(response.status_code, 200)
        
        # Check if the response contains the expected result
        response_json = response.get_json()
        self.assertIn('hairstyleUrl', response_json)
        self.assertEqual(response_json['hairstyleUrl'], "http://somewhere.com/generated_hairstyle.jpg")

    def test_generate_hairstyle_missing_data(self):
        # Missing faceImageUrl
        data = {"celebImageUrl": "http://somewhere.com/celeb.jpg"}
        
        response = self.client.post('/generate-hairstyle', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        response_json = response.get_json()
        self.assertEqual(response_json['error'], "Missing faceImageUrl or celebImageUrl")

        # Missing celebImageUrl
        data = {"faceImageUrl": "http://somewhere.com/user_face.jpg"}
        
        response = self.client.post('/generate-hairstyle', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        response_json = response.get_json()
        self.assertEqual(response_json['error'], "Missing faceImageUrl or celebImageUrl")

    @patch('server.generate_hairstyle')  # Mocking for internal errors
    def test_generate_hairstyle_internal_error(self, mock_generate_hairstyle):
        # Simulating an exception in the generate_hairstyle function
        mock_generate_hairstyle.side_effect = Exception("Internal error occurred")
        
        data = {
            "faceImageUrl": "http://somewhere.com/user_face.jpg",
            "celebImageUrl": "http://somewhere.com/celeb.jpg"
        }
        
        response = self.client.post('/generate-hairstyle', data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, 500)
        response_json = response.get_json()
        self.assertEqual(response_json['error'], "Internal error occurred")

if __name__ == '__main__':
    unittest.main()

