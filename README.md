# CelebMax

CelebMax is a web application that allows users to upload a photo of themselves and receive personalized hairstyle recommendations based on celebrity lookalikes. Our system uses a trained AI model to compare the user’s image against a dataset of 25,000 celebrity images, selecting the top 5 matches. Users can then choose one of these celebrities and apply the celebrity’s hairstyle onto their own photo.

### Created By:

- Jacob Hoppenstedt
- Daniel Dovale
- Rohith Vellore
- Veeraj Reddy Talasani
---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting Up External Files](#setting-up-external-files)
- [Docker Compose Setup](#docker-compose-setup)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Celebrity/Model Matching:**  
  - Users upload a photo.
  - The backend calls an AI model that searches through a dataset of 25,000 celebrity images.
  - The system picks the top 5 most similar faces based on facial similarity.
  
- **Hairstyle & Outfit Recommendations:**  
  - Once a celebrity match is selected, users receive hairstyle recommendations.
  - Integration with HairFastGAN-AI allows users to overlay the celebrity’s hair onto their own image.
  
- **User Authentication:**  
  - Secure signup and login functionalities with basic authentication.
  
- **Modular Architecture:**  
  - A Go backend that handles API requests and user authentication.
  - A Python-based microservice that performs AI model inference.
  
- **Docker Compose Integration:**  
  - Use Docker Compose to build and run the entire stack with a single command.

---

## Getting Started

### Prerequisites

- **Docker & Docker Compose:**  
  Ensure you have Docker installed on your machine. [Get Docker](https://docs.docker.com/get-docker/)

- **Go 1.19+**  
- **Python 3.8+** (handled via Docker in our setup)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/jacobhoppenstedt/celebmax.git
   cd celebmax

2. **Install Go Dependencies:**
   ```bash
   go mod tidy
3. **Configure Environment Variables:**
Create a .env file in the root of the project with the following content:
  ```bash
PYTHON_SERVICE_URL=http://localhost:5001
```
## Setting Up External Files

The python-service requires several large external files (e.g., pre-trained model weights and parts of the 25,000 celebrity dataset). These files are not included in the repository to keep the repository lightweight.

### To set up these files:

#### Download the Files:
Download the required files from our [Google Drive folder](https://drive.google.com/drive/folders/1pYFtYQQ0w601FBcYSmRxb5gJ6LDIzyIa?usp=sharing).

#### Place the Files:
After downloading, place the files into the `python-service` directory. The expected structure is:
```python
celebmax/
├── python-service/
│   ├── Haircut/
│   │   └── (files related to HairFastGAN-AI or hairstyle processing)
│   ├── .gitattributes
│   ├── aws_credentials.py
│   ├── clustered_embeddings.npy
│   ├── Dockerfile
│   ├── kmeans_model.pkl
│   ├── main.py
│   ├── requirements.txt
│   └── tests3.py
├── backend/
└── docker-compose.yml
```

## Docker Compose Setup

A `docker-compose.yml` file is provided in the root of the project to orchestrate the Go backend and the python-service.

### Build and Run the Containers

From the project root, run:

```bash
docker-compose up --build
```
This command will build the images (if necessary) and start the services:

- Backend (Go Server): Runs on port 8080.

- Python-service: Runs on port 5001.

## Contributing
We welcome contributions! To contribute:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Follow the coding standards and include tests for any new functionality.

4. Submit a pull request with a clear description of your changes.


## License
This project is licensed under the MIT License. See the LICENSE file for details.



