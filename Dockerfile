FROM python:3.12.1

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    # --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install unixODBC and other dependencies
RUN apt-get update && apt-get install -y \
    curl\
    unixodbc \
    unixodbc-dev \
    gcc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Check if the Debian version is supported and configure Microsoft repo
RUN curl -sSL -O https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb && \
    # Install the package
    dpkg -i packages-microsoft-prod.deb && \
    # Delete the file
    rm packages-microsoft-prod.deb && \
    # Update apt-get and install the ODBC driver and tools
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Load project dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Switch to the non-privileged user to run the application.
USER appuser

# Copy the source code into the container.
COPY . /app

# Expose the port that the application listens on.
EXPOSE 8080

# Start the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]