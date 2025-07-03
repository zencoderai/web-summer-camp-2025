# Web Summer Camp 2025 - Conference Website

A full-stack conference website for Web Summer Camp 2025, taking place July 3-5, 2025 at Hotel Ambasador in Opatija, Croatia. Built with React frontend, FastAPI backend, and PostgreSQL database.

## Features

- **Home Page**: Conference introduction with real dates, location, and track information
- **Submit Talk**: Form for speakers to submit talk proposals across 6 specialized tracks
- **View Talks**: Display all submitted talks with track categorization and details
- **Track System**: Color-coded track badges and filtering
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly experience
- **Call for Papers**: Open until March 15th, 2025
- **Auto-Migration**: Database schema updates automatically on startup

## Conference Tracks

Web Summer Camp 2025 features six specialized tracks:

1. **JavaScript Track** 🟡 - Frontend frameworks, Node.js, modern JavaScript
2. **PHP Track** 🟣 - Backend development, frameworks, best practices
3. **Python/AI Track** 🔵 - Python development and AI/ML applications
4. **UX Track** 🩷 - User experience design and research
5. **Founders Track** 🟢 - Entrepreneurship and startup insights
6. **Digital Change Track** 🟦 - Digital transformation and innovation

## Tech Stack

- **Frontend**: React 18, React Router, Axios, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## Project Structure

```
web-summer-camp-2025/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   └── ...
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/                 # FastAPI backend application
│   ├── main.py             # FastAPI app entry point with auto-migration
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database configuration
│   ├── migrate.py          # Database migration script
│   ├── Dockerfile
│   └── requirements.txt
└── docker-compose.yml      # Docker Compose configuration
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system

### Running the Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd web-summer-camp-2025
   ```

2. Start all services with Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Development Setup

If you prefer to run services individually for development:

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up PostgreSQL database and update the DATABASE_URL in `database.py`

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /` - Health check
- `POST /api/talks` - Submit a new talk
- `GET /api/talks` - Get all submitted talks
- `GET /api/talks/{talk_id}` - Get a specific talk
- `DELETE /api/talks/{talk_id}` - Delete a talk

## Database Schema

### Talks Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| title | String(255) | Talk title |
| speaker_name | String(255) | Speaker's name |
| speaker_email | String(255) | Speaker's email |
| speaker_bio | Text | Speaker's biography (optional) |
| description | Text | Talk description |
| duration | Integer | Talk duration in minutes (15, 30, 45, 60) |
| level | String(50) | Difficulty level (Beginner, Intermediate, Advanced) |
| track | String(50) | Conference track (JavaScript, PHP, Python/AI, UX, Founders, Digital Change) |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

## Docker Services

- **frontend**: React development server (port 3000)
- **backend**: FastAPI server with auto-reload (port 8000)
- **db**: PostgreSQL 15 database (port 5432)

## Database Migration

The application includes automatic database migration on startup. When you first run the application or add new fields, the backend will automatically:

1. Create the database tables if they don't exist
2. Add missing columns (like the `track` field) to existing tables
3. Set default values for new columns

No manual migration steps are required!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.