# Web Summer Camp 2025 - Conference Website

A full-stack conference website built with React frontend, FastAPI backend, and PostgreSQL database.

## Features

- **Home Page**: Conference introduction and information
- **Submit Talk**: Form for speakers to submit their talk proposals
- **View Talks**: Display all submitted talks with filtering by track
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **API Monitoring**: Prometheus metrics integration
- **Database**: PostgreSQL with SQLAlchemy ORM

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls

### Backend
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Prometheus metrics
- Pydantic for data validation

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 15
- Prometheus (metrics collection)
- Grafana (monitoring dashboards)

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd web-summer-camp-2025
```

2. Start all services:
```bash
docker compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)
- Metrics: http://localhost:8000/metrics

### Local Development

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check with database status
- `POST /api/talks` - Submit a new talk
- `GET /api/talks` - Get all submitted talks
- `GET /api/talks/{id}` - Get a specific talk
- `DELETE /api/talks/{id}` - Delete a talk
- `GET /metrics` - Prometheus metrics
- `GET /metrics/refresh` - Manually refresh metrics (useful for debugging)

## Database Schema

### Talks Table
- `id` (Primary Key)
- `title` - Talk title
- `speaker_name` - Speaker's name
- `speaker_email` - Speaker's email
- `speaker_bio` - Speaker biography (optional)
- `description` - Talk description
- `duration` - Talk duration in minutes (default: 30)
- `level` - Difficulty level (Beginner/Intermediate/Advanced)
- `track` - Conference track (JavaScript/Frontend/Backend/DevOps)
- `created_at` - Submission timestamp
- `updated_at` - Last update timestamp

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

```bash
cp .env.example .env
```

## Docker Services

- **db**: PostgreSQL 15 database
- **backend**: FastAPI application
- **frontend**: React development server
- **prometheus**: Metrics collection and storage
- **grafana**: Monitoring dashboards and visualization

## Development

### Adding New Features

1. Backend changes: Modify files in `./backend/`
2. Frontend changes: Modify files in `./frontend/src/`
3. Database changes: Update `models.py` and create migrations

### Database Migrations

The application automatically handles basic migrations. For complex schema changes, modify the migration logic in `main.py`.

## Production Deployment

For production deployment:

1. Update environment variables
2. Use production-ready database credentials
3. Configure proper CORS origins
4. Set up reverse proxy (nginx)
5. Use production build for React app

## Monitoring

The application includes comprehensive monitoring with Prometheus and Grafana:

### Metrics Available
- HTTP request counts, durations, and status codes
- Database operation performance
- Custom business metrics (talks created, deleted, retrieved)
- System metrics (CPU, memory usage)
- Service health status

### Dashboards
- **Conference API Dashboard**: API performance and business metrics
- **System Metrics Dashboard**: System health and resource usage

### Access Points
- Raw metrics: http://localhost:8000/metrics
- Prometheus UI: http://localhost:9090
- Grafana dashboards: http://localhost:3001 (admin/admin)

### Testing Monitoring
Use the provided test script to generate API traffic:
```bash
cd monitoring
python test_monitoring.py
# Or generate continuous load:
python test_monitoring.py load 10 20  # 10 minutes, 20 requests/minute
```

For detailed monitoring setup, see [monitoring/README.md](monitoring/README.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.