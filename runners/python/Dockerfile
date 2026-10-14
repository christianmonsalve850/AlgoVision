# Use a secure, official lightweight Python runtime
FROM python:3.12-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the runner and harness into the image
COPY runner.py harness.py ./

# Ensure Python output is unbuffered so stdout is sent back immediately
CMD ["python", "-u", "runner.py"]