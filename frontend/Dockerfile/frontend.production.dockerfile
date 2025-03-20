# Step 1: Build the app using Vite
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_API_URL="http://ec2-13-60-18-228.eu-north-1.compute.amazonaws.com:3000/api"
ENV VITE_WEB_SOCKET_URL="ws://ec2-13-60-18-228.eu-north-1.compute.amazonaws.com:3000/"

RUN npm run build