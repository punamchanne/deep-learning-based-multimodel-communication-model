#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt

# Remove GUI versions of OpenCV that crash on a headless server
pip uninstall -y opencv-python opencv-contrib-python

# Install headless versions that work perfectly on Render
pip install opencv-python-headless opencv-contrib-python-headless
