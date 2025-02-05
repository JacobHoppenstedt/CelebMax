if [[ $(uname -m) == 'arm64' ]]; then
    echo "Apple Silicon detected. Installing TensorFlow-Metal and TensorFlow-MacOS."
    pip install tensorflow-macos tensorflow-metal
else
    echo "Intel Mac detected. Installing regular TensorFlow."
    pip install tensorflow==2.12.0rc0
fi

# Install remaining requirements
pip install -r requirements.txt