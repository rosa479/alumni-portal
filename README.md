# Alum Portal | TSG

_*Under Construction 🏗️*_

---
## Technology Stack

* **Backend**: Django & Django REST Framework
* **Database**: PostgreSQL
* **Authentication**: JSON Web Tokens (JWT) via `djangorestframework-simplejwt`
* **Deployment (Planned)**: Docker, Amazon EKS (Kubernetes)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    ```
    Then cd into the directory

2.  **Create and activate a virtual environment:**
    ```bash
    # Create the virtual environment
    python -m venv venv

    # Activate it
    # On macOS/Linux:
    source venv/bin/activate
    # On Windows:
    venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the PostgreSQL Database:**
    Open the PostgreSQL command-line tool (`psql`) and create a database and user.
    ```sql
    CREATE DATABASE alum_db;
    CREATE USER db_user WITH PASSWORD 'strongpassword';
    GRANT ALL PRIVILEGES ON DATABASE alum_db TO db_user;
    ```

5.  **Configure Environment Variables:**
    Create a `.env` file in the project root by copying the example file.
    ```bash
    cp example.env .env
    ```
    Now, open the `.env` file and fill in the details for your database and a new Django secret key.
    ```ini
    SECRET_KEY=your-django-secret-key-goes-here

    DB_NAME=alum_db
    DB_USER=db_user
    DB_PASSWORD=strongpassword
    DB_HOST=localhost
    DB_PORT=5432
    ```

6.  **Run Database Migrations:**
    This will create all the necessary tables in your PostgreSQL database.
    ```bash
    python manage.py migrate
    ```

7.  **Create a Superuser (Admin):**
    This account will have admin privileges on the platform.
    ```bash
    python manage.py createsuperuser
    ```

8.  **Run the Development Server:**
    ```bash
    python manage.py runserver
    ```
    The API is now live at `http://127.0.0.1:8000/`.

---
## API Endpoints

Here are the primary API endpoints currently available.

| Method | Endpoint                                   | Description                        | Authorization      |
| :----- | :----------------------------------------- | :--------------------------------- | :----------------- |
| `POST` | `/api/auth/register/`                      | Register a new user.               | Public             |
| `POST` | `/api/auth/login/`                         | Log in and receive JWTs.           | Public             |
| `GET`  | `/api/profiles/me/`                        | Get the current user's profile.    | User (Authenticated) |
| `PUT`  | `/api/profiles/me/`                        | Update the current user's profile. | User (Authenticated) |
| `GET`  | `/api/communities/`                        | List all communities.              | User (Authenticated) |
| `POST` | `/api/posts/`                              | Create a new post (pending).       | User (Authenticated) |
| `GET`  | `/api/communities/<uuid>/posts/`           | List approved posts in a community.| User (Authenticated) |
| `GET`  | `/api/admin/verifications/`                | List users pending verification.   | Admin              |
| `POST` | `/api/admin/verifications/<uuid>/approve/` | Approve a user's verification.     | Admin              |
| `GET`  | `/api/admin/posts/pending/`                | List posts pending moderation.     | Admin              |
| `POST` | `/api/admin/posts/<uuid>/approve/`         | Approve a pending post.            | Admin              |
| `POST` | `/api/admin/posts/<uuid>/reject/`          | Reject a pending post.             | Admin              |

---
