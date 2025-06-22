FROM node:18-slim

# Install Python 3 + pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY backend ./backend

# Install Python deps
RUN pip install homeharvest==0.2.18 pandas openpyxl tls-client

EXPOSE 8080
CMD ["node", "backend/index.js"]
