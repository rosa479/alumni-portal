# Alum Portal | TSG

_*Under Construction 🏗️*_

---

## Technology Stack

- **Backend**: Django & Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) via `djangorestframework-simplejwt`
- **Deployment (Planned)**: Docker, Amazon EKS (Kubernetes)

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

4.  **Configure Environment Variables:**
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

5.  **Run Postgres docker container**

    ```bash
    docker compose up --build
    ```

6.  **Run Database Migrations:**
    This will create all the necessary tables in your PostgreSQL database.

    ```bash
    python manage.py migrate
    ```

7.  **Load Sample Data (Optional but Recommended):**
    Load sample data including users, communities, posts, and scholarships for testing.

    ```bash
    python manage.py load_sample_data
    ```

    To clear existing data and reload fresh sample data:

    ```bash
    python manage.py load_sample_data --clear
    ```

8.  **Create a Superuser (Admin):**
    This account will have admin privileges on the platform.

    ```bash
    python manage.py createsuperuser
    ```

9.  **Run the Development Server:**

    ```bash
    python manage.py runserver
    ```

    The API is now live at `http://127.0.0.1:8000/`.

10. **Admin panel**
    Django Admin panel is available on `http://localhost:8000/admin`, login using superuser credentials.

---

## API Endpoints

Here are the primary API endpoints currently available.

| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `POST` | `/api/auth/register/`                      | Register a new user.                | Public               |
| `POST` | `/api/auth/login/`                         | Log in and receive JWTs.            | Public               |
| `GET`  | `/api/profiles/me/`                        | Get the current user's profile.     | User (Authenticated) |
| `PUT`  | `/api/profiles/me/`                        | Update the current user's profile.  | User (Authenticated) |
| `GET`  | `/api/communities/`                        | List all communities.               | User (Authenticated) |
| `POST` | `/api/posts/`                              | Create a new post (pending).        | User (Authenticated) |
| `GET`  | `/api/communities/<uuid>/posts/`           | List approved posts in a community. | User (Authenticated) |
| `GET`  | `/api/scholarships/`                       | List all scholarships.              | User (Authenticated) |
| `GET`  | `/api/scholarships/<uuid>/`                | Get scholarship details.            | User (Authenticated) |
| `POST` | `/api/scholarships/`                       | Create a new scholarship.           | User (Authenticated) |
| `POST` | `/api/scholarships/<uuid>/contribute/`     | Contribute to a scholarship.        | User (Authenticated) |
| `GET`  | `/api/admin/verifications/`                | List users pending verification.    | Admin                |
| `POST` | `/api/admin/verifications/<uuid>/approve/` | Approve a user's verification.      | Admin                |
| `GET`  | `/api/admin/posts/pending/`                | List posts pending moderation.      | Admin                |
| `POST` | `/api/admin/posts/<uuid>/approve/`         | Approve a pending post.             | Admin                |
| `POST` | `/api/admin/posts/<uuid>/reject/`          | Reject a pending post.              | Admin                |

---

## Work Remaning:

1. The Posts section don't have comments setup yet
2. Scholarships section needs to be api integrated
3. payment gateway
4. fund-raising system
5. messaging system (not yet decided upon)
6. profile editing is not enabled form the frontend
7. admin flow for doing stuff in admin panel
8. credit_points logic (backend)

Lastly, some bug fixing and testing itertations are left as well.
