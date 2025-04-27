from celery import Celery

# Initialize Celery app
celery = Celery(
    'memecoin_tracker',
    broker='amqp://guest:guest@rabbitmq:5672//',
    backend='redis://redis:6379/0'
)

# Configure Celery
celery.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

# Example task (replace with actual tasks, e.g., X scraping, market data fetching)
@celery.task
def example_task():
    print("Running example Celery task")
    return "Task completed"