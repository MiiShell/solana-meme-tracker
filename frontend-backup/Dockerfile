# Build stage
FROM node:18 AS builder
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install

# Copy remaining source code
COPY . .

# Build React app
RUN npm run build

# Production stage
FROM nginx:1.23
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]