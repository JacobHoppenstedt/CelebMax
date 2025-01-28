from flask import Flask, request, jsonify
import numpy as np
from deepface import DeepFace
from scipy.spatial.distance import cosine
import cv2
import os

app = Flask(__name__)

def match_celebrity():
    """
    Expects an image file upload.
    Returns the best match or multiple matches with their distances.
    """