Solana Meme Coin Tracking Tool

This project is a comprehensive tool for tracking meme coins on the Solana blockchain. It aggregates real-time data from X posts, CoinGecko/CoinMarketCap APIs, and Solscan, providing trading insights through sentiment analysis, follower tracking, market cap monitoring, and all-time high (ATH) comparisons. The application features a React-based frontend dashboard, a FastAPI backend, and a Celery task queue for asynchronous processing, all orchestrated with Docker and Kubernetes for scalability.

Table of Contents

-   Features (#features)
    
-   Project Structure (#project-structure)
    
-   Prerequisites (#prerequisites)
    
-   Setup Instructions (#setup-instructions)
    
    -   Local Testing with Docker Compose (#local-testing-with-docker-compose)
        
    -   Pre-Production Deployment with Kubernetes (#pre-production-deployment-with-kubernetes)
        
-   Troubleshooting (#troubleshooting)
    
-   Monitoring and Maintenance (#monitoring-and-maintenance)
    
-   Contributing (#contributing)
    
-   License (#license)
    

Features

-   Real-Time Data Aggregation:
    
    -   Fetches X posts and follower counts for sentiment analysis and trading signals.
        
    -   Retrieves market cap and ATH data from CoinGecko/CoinMarketCap APIs.
        
    -   Validates Solana contract addresses using Solscan.
        
-   Frontend Dashboard:
    
    -   Displays coin metrics (ticker, market cap, ATH, follower count, sentiment score) in a table.
        
    -   Visualizes time-series data (market cap, follower growth) with Chart.js.
        
    -   Includes a search bar for filtering coins.
        
-   Backend Processing:
    
    -   FastAPI serves REST endpoints for the dashboard.
        
    -   Celery handles asynchronous tasks (e.g., X scraping, market data fetching).
        
    -   PostgreSQL stores historical data, Redis caches real-time metrics.
        
-   Scalable Infrastructure:
    
    -   Docker Compose for local testing.
        
    -   Kubernetes for pre-production deployment with auto-scaling.
        
    -   Prometheus and Grafana for monitoring.
        

Project Structure

```
<span>solana-meme-tracker/
</span>├── backend/                    # FastAPI backend
│   ├── app/                    # Application code
│   │   ├── main.py             # FastAPI entry point
│   │   ├── routes/             # API routes
│   │   ├── services/           # Data ingestion, NLP, etc.
│   │   └── models/             # SQLAlchemy models
│   ├── celery_worker.py        # Celery worker configuration
│   ├── Dockerfile              # Backend Dockerfile
│   ├── requirements.txt        # Python dependencies
│   └── scripts/                # Utility scripts
│       └── init_db.py          # Database initialization
├── frontend/                   # React frontend
│   ├── src/                    # React source code
│   │   ├── App.js              # Main dashboard component
│   │   └── index.js            # React entry point
│   ├── public/                 # Static assets
│   │   └── index.html          # HTML template
│   ├── Dockerfile              # Frontend Dockerfile
│   ├── nginx.conf              # Nginx config for serving React
│   ├── package.json            # Node dependencies
│   └── package-lock.json       # Dependency lockfile
├── k8s/                        # Kubernetes manifests
│   ├── deployment.yaml         # Backend/frontend deployments
│   ├── service.yaml            # Load balancer services
│   ├── ingress.yaml            # Ingress for routing
│   └── secrets.yaml            # Kubernetes secrets
├── monitoring/                 # Monitoring configs
│   ├── prometheus.yml          # Prometheus configuration
│   └── grafana/                # Grafana dashboards
├── docker-compose.yml          # Docker Compose for local testing
├── .env.example                # Example environment variables
└── README.md                   # Project documentation
```

Prerequisites

-   Docker: Version 20.10 or higher.
    
-   Docker Compose: Version 2.0 or higher.
    
-   Node.js: Version 18 for frontend development.
    
-   Python: Version 3.10 for backend development.
    
-   kubectl: For Kubernetes deployment.
    
-   Cloud Provider: AWS EKS or GCP GKE for pre-production.
    
-   API Keys:
    
    -   X API key for post and follower data.
        
    -   CoinGecko/CoinMarketCap API key for market data.
        
    -   Solscan API key for contract validation.
        

Setup Instructions

Local Testing with Docker Compose

Follow these steps to set up and test the application locally.

1.  Clone the Repository:
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">git</span><span> clone </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>repo_url</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>
    </span><span></span><span class="token" style="color: rgb(78, 201, 176);">cd</span><span> solana-meme-tracker</span>
    ```
    
2.  Set Up Environment Variables: Copy the example environment file and update with your credentials:
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">cp</span><span> .env.example .env</span>
    ```
    
    Edit .env to include your API keys (replace testcredentials with actual keys):
    
    env
    
    ```
    <span>DATABASE_URL=postgresql://testuser:testcredentials@db:5432/memecoins
    </span>REDIS_URL=redis://redis:6379/0
    RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672//
    X_API_KEY=testcredentials
    COINGECKO_API_KEY=testcredentials
    SENTRY_DSN=https://&lt;your-sentry-dsn&gt;
    REACT_APP_API_URL=http://localhost:8000
    ```
    
3.  Initialize the Frontend: Navigate to the frontend/ directory and install dependencies:
    
    bash
    
    ```
    <span class="token" style="color: rgb(78, 201, 176);">cd</span><span> frontend
    </span><span></span><span class="token" style="color: rgb(220, 220, 170);">npm</span><span> </span><span class="token" style="color: rgb(220, 220, 170);">install</span>
    ```
    
    Test the frontend locally:
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">npm</span><span> start</span>
    ```
    
    Open http://localhost:3000 to verify the dashboard loads.
    
4.  Build and Run Docker Compose: Return to the project root and start the services:
    
    bash
    
    ```
    <span class="token" style="color: rgb(78, 201, 176);">cd</span><span> </span><span class="token" style="color: rgb(212, 212, 212);">..</span><span>
    </span><span></span><span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> up --build</span>
    ```
    
    Access the services:
    
    -   Frontend: http://localhost
        
    -   Backend: http://localhost:8000/docs (FastAPI Swagger UI)
        
    -   Prometheus: http://localhost:9090
        
    -   Grafana: http://localhost:3000 (default login: admin/admin)
        
    -   RabbitMQ: http://localhost:15672 (default login: guest/guest)
        
5.  Initialize the Database: Run the database initialization script:
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> </span><span class="token" style="color: rgb(78, 201, 176);">exec</span><span> backend python scripts/init_db.py</span>
    ```
    
6.  Verify Celery Tasks: Check Celery worker logs to ensure tasks are running:
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> logs celery</span>
    ```
    

Pre-Production Deployment with Kubernetes

Deploy the application to a Kubernetes cluster (e.g., AWS EKS or GCP GKE) for pre-production testing.

1.  Set Up Kubernetes Cluster:
    
    -   Create an EKS/GKE cluster with at least 3 nodes (e.g., t3.medium instances).
        
    -   Install kubectl and configure cluster access:
        
        bash
        
        ```
        <span>aws eks update-kubeconfig --name </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>cluster-name</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span>
        ```
        
2.  Build and Push Docker Images: Build and push images to a container registry (e.g., AWS ECR, Docker Hub):
    
    bash
    
    ```
    <span class="token" style="color: rgb(220, 220, 170);">docker</span><span> build -t </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>your-registry</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>/memecoin-backend:latest ./backend
    </span><span></span><span class="token" style="color: rgb(220, 220, 170);">docker</span><span> build -t </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>your-registry</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>/memecoin-frontend:latest ./frontend
    </span><span></span><span class="token" style="color: rgb(220, 220, 170);">docker</span><span> push </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>your-registry</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>/memecoin-backend:latest
    </span><span></span><span class="token" style="color: rgb(220, 220, 170);">docker</span><span> push </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>your-registry</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>/memecoin-frontend:latest</span>
    ```
    
3.  Apply Kubernetes Manifests: Update k8s/deployment.yaml with your registry URLs, then apply:
    
    bash
    
    ```
    <span>kubectl create namespace memecoin
    </span>kubectl apply -f k8s/secrets.yaml
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml
    ```
    
4.  Configure DNS: Point a domain (e.g., memecoin.preprod.example.com) to the Ingress LoadBalancer IP:
    
    bash
    
    ```
    <span>kubectl get ingress -n memecoin</span>
    ```
    
5.  Set Up Monitoring: Deploy Prometheus and Grafana using Helm:
    
    bash
    
    ```
    <span>helm </span><span class="token" style="color: rgb(220, 220, 170);">install</span><span> prometheus prometheus-community/prometheus --namespace memecoin
    </span><span>helm </span><span class="token" style="color: rgb(220, 220, 170);">install</span><span> grafana grafana/grafana --namespace memecoin</span>
    ```
    
    Access Grafana at http://<grafana-url> and import dashboards from monitoring/grafana/.
    
6.  Verify Deployment: Check pod status:
    
    bash
    
    ```
    <span>kubectl get pods -n memecoin</span>
    ```
    
    Access the frontend at http://memecoin.preprod.example.com.
    

Troubleshooting

Frontend Issues

-   Missing index.html:
    
    -   Ensure frontend/public/index.html exists. Reinitialize the frontend if needed:
        
        bash
        
        ```
        <span class="token" style="color: rgb(78, 201, 176);">cd</span><span> frontend
        </span><span>npx create-react-app </span><span class="token" style="color: rgb(78, 201, 176);">.</span><span>
        </span><span></span><span class="token" style="color: rgb(220, 220, 170);">npm</span><span> </span><span class="token" style="color: rgb(220, 220, 170);">install</span>
        ```
        
-   Dependency Errors:
    
    -   If npm install fails (e.g., due to web-vitals):
        
        1.  Remove src/reportWebVitals.js:
            
            bash
            
            ```
            <span class="token" style="color: rgb(220, 220, 170);">rm</span><span> frontend/src/reportWebVitals.js</span>
            ```
            
        2.  Update src/index.js to remove reportWebVitals import.
            
        3.  Reinstall dependencies:
            
            bash
            
            ```
            <span class="token" style="color: rgb(220, 220, 170);">npm</span><span> </span><span class="token" style="color: rgb(220, 220, 170);">install</span>
            ```
            
-   Build Failures:
    
    -   Clear Node modules and reinstall:
        
        bash
        
        ```
        <span class="token" style="color: rgb(78, 201, 176);">cd</span><span> frontend
        </span><span></span><span class="token" style="color: rgb(220, 220, 170);">rm</span><span> -rf node_modules package-lock.json
        </span><span></span><span class="token" style="color: rgb(220, 220, 170);">npm</span><span> </span><span class="token" style="color: rgb(220, 220, 170);">install</span>
        ```
        

Backend Issues

-   Celery Failure:
    
    -   Ensure backend/celery\_worker.py exists and defines the celery app:
        
        python
        
        ```
        <span class="token" style="color: rgb(86, 156, 214);">from</span><span> celery </span><span class="token" style="color: rgb(86, 156, 214);">import</span><span> Celery
        </span><span>celery </span><span class="token" style="color: rgb(212, 212, 212);">=</span><span> Celery</span><span class="token" style="color: rgb(212, 212, 212);">(</span><span class="token" style="color: rgb(206, 145, 120);">'memecoin_tracker'</span><span class="token" style="color: rgb(212, 212, 212);">,</span><span> broker</span><span class="token" style="color: rgb(212, 212, 212);">=</span><span class="token" style="color: rgb(206, 145, 120);">'amqp://guest:guest@rabbitmq:5672//'</span><span class="token" style="color: rgb(212, 212, 212);">,</span><span style=""> backend</span><span class="token" style="color: rgb(212, 212, 212);">=</span><span class="token" style="color: rgb(206, 145, 120);">'redis://redis:6379/0'</span><span class="token" style="color: rgb(212, 212, 212);">)</span>
        ```
        
    -   Check Celery logs:
        
        bash
        
        ```
        <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> logs celery</span>
        ```
        
-   Metrics 404:
    
    -   Verify the /metrics endpoint in backend/app/main.py:
        
        python
        
        ```
        <span class="token" style="color: rgb(86, 156, 214);">from</span><span> prometheus_client </span><span class="token" style="color: rgb(86, 156, 214);">import</span><span> generate_latest
        </span><span></span><span class="token" style="color: rgb(86, 156, 214);">from</span><span> fastapi</span><span class="token" style="color: rgb(212, 212, 212);">.</span><span>responses </span><span class="token" style="color: rgb(86, 156, 214);">import</span><span> PlainTextResponse
        </span><span></span><span class="token decorator annotation" style="color: rgb(212, 212, 212);">@app</span><span class="token decorator annotation" style="color: rgb(212, 212, 212);">.</span><span class="token decorator annotation" style="color: rgb(212, 212, 212);">get</span><span class="token" style="color: rgb(212, 212, 212);">(</span><span class="token" style="color: rgb(206, 145, 120);">"/metrics"</span><span class="token" style="color: rgb(212, 212, 212);">)</span><span>
        </span><span></span><span class="token" style="color: rgb(86, 156, 214);">async</span><span> </span><span class="token" style="color: rgb(86, 156, 214);">def</span><span> </span><span class="token" style="color: rgb(220, 220, 170);">metrics</span><span class="token" style="color: rgb(212, 212, 212);">(</span><span class="token" style="color: rgb(212, 212, 212);">)</span><span class="token" style="color: rgb(212, 212, 212);">:</span><span>
        </span><span>    </span><span class="token" style="color: rgb(86, 156, 214);">return</span><span> PlainTextResponse</span><span class="token" style="color: rgb(212, 212, 212);">(</span><span>generate_latest</span><span class="token" style="color: rgb(212, 212, 212);">(</span><span class="token" style="color: rgb(212, 212, 212);">)</span><span class="token" style="color: rgb(212, 212, 212);">)</span>
        ```
        
    -   Ensure prometheus-client is in requirements.txt.
        

Docker Issues

-   Build Cache Errors:
    
    -   Clear the Docker build cache:
        
        bash
        
        ```
        <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> build --no-cache</span>
        ```
        
-   Service Failures:
    
    -   Check logs for specific services:
        
        bash
        
        ```
        <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> logs </span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>service-name</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span>
        ```
        

Monitoring and Maintenance

-   Monitoring:
    
    -   Use Prometheus (http://localhost:9090) and Grafana (http://localhost:3000) to monitor CPU, memory, and API latency.
        
    -   Set up alerts in Grafana for high error rates or latency.
        
-   Backups:
    
    -   Schedule daily PostgreSQL backups to S3:
        
        bash
        
        ```
        <span class="token" style="color: rgb(220, 220, 170);">docker-compose</span><span> </span><span class="token" style="color: rgb(78, 201, 176);">exec</span><span> backend </span><span class="token" style="color: rgb(220, 220, 170);">bash</span><span> scripts/backup_db.sh</span>
        ```
        
    -   Test restore procedures monthly.
        
-   Scaling:
    
    -   Configure Horizontal Pod Autoscaling (HPA) in Kubernetes based on CPU/memory usage.
        
    -   Use AWS Auto Scaling Groups for cluster nodes.
        
-   Updates:
    
    -   Test updates in a staging environment before pre-production.
        
    -   Use rolling updates for zero-downtime deployments:
        
        bash
        
        ```
        <span>kubectl </span><span class="token" style="color: rgb(78, 201, 176);">set</span><span> image deployment/backend </span><span class="token assign-left" style="color: rgb(156, 220, 254);">backend</span><span class="token" style="color: rgb(212, 212, 212);">=</span><span class="token" style="color: rgb(212, 212, 212);">&lt;</span><span>your-registry</span><span class="token" style="color: rgb(212, 212, 212);">&gt;</span><span>/memecoin-backend:latest -n memecoin</span>
        ```
        

Contributing

1.  Fork the repository.
    
2.  Create a feature branch (git checkout -b feature/<feature-name>).
    
3.  Commit changes (git commit -m "Add feature").
    
4.  Push to the branch (git push origin feature/<feature-name>).
    
5.  Open a pull request.
    

License

This project is licensed under the MIT License. See the LICENSE file for details.

___

Notes

-   Customizations: The README.md assumes the project structure and fixes from our previous discussions (e.g., Material-UI v5, Celery setup, Prometheus metrics). If you have additional features or files (e.g., specific backend routes), let me know, and I can update the documentation.
    
-   Troubleshooting: The troubleshooting section covers common issues we’ve encountered (e.g., missing index.html, web-vitals, Celery failures, metrics 404).
    
-   Pre-Production: The Kubernetes deployment section is concise but references the manifests provided earlier. I can expand it with more details if needed.
    

If you need further modifications to the README.md (e.g., adding specific backend tasks, team credits, or deployment diagrams), or if you want to address any remaining issues (e.g., implementing backend logic, testing Celery tasks), please let me know!
