# Use a secure, official lightweight Python runtime
FROM python:3.12-slim

# Create a non-root user and group
RUN groupadd -g 65532 runnergroup && \
    useradd -u 65532 -g runnergroup -m -s /bin/bash runneruser

# Set the working directory inside the container
WORKDIR /app

# Copy the runner and harness into the image
COPY runner.py harness.py ./
COPY tracing ./tracing

# Change ownership of the app directory to the non-root user
RUN chown -R runneruser:runnergroup /app

# Switch to the non-root user
USER 65532:65532

# Ensure Python output is unbuffered so stdout is sent back immediately
CMD ["python", "-u", "runner.py"]