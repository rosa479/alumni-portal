# Alum Portal | TSG

_*IIT Kharagpur Alumni Portal - Connecting Alumni Worldwide*_

---

## Technology Stack

- **Backend**: Django & Django REST Framework
- **Frontend**: React with Vite, Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT) via `djangorestframework-simplejwt`
- **File Storage**: AWS S3 (configurable from env)
- **Rich Text Editor**: @uiw/react-md-editor
- **Icons**: react-feather
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

    Now, open the `.env` file and fill in the details for your database, AWS S3, and a new Django secret key.

    ```ini
    SECRET_KEY=your-django-secret-key-goes-here

    DB_NAME=alum_db
    DB_USER=db_user
    DB_PASSWORD=strongpassword
    DB_HOST=localhost
    DB_PORT=5432

    # AWS S3 Configuration (Optional - falls back to local storage if not provided)
    AWS_ACCESS_KEY_ID=your_aws_access_key_id
    AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
    AWS_STORAGE_BUCKET_NAME=your_s3_bucket_name
    AWS_S3_REGION_NAME=us-east-1

    # Base URL for the application
    BASE_URL=http://localhost:8000
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

10. **Run the Frontend Development Server:**
    Open a new terminal and navigate to the frontend directory:

    ```bash
    cd portal-frontend
    npm install
    npm run dev
    ```

    The frontend is now live at `http://localhost:5173/`.

11. **Admin panel**
    Django Admin panel is available on `http://localhost:8000/admin`, login using superuser credentials.

---

## Features

### 🎯 Core Features
- **User Authentication**: JWT-based login/register system
- **Profile Management**: Complete alumni profiles with verification
- **Community System**: Join communities, create posts, interact with alumni
- **Rich Content**: Markdown editor for posts, image uploads via AWS S3
- **Social Interactions**: Like posts, comment system, smart sharing
- **Tag System**: Community-specific tags for better organization
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 📱 Frontend Features
- **Modern UI**: Clean, professional design with IIT Kharagpur branding
- **Interactive Posts**: Like, comment, and share functionality
- **Smart Sharing**: Web Share API for mobile, clipboard for desktop
- **Rich Text Editor**: Markdown support for posts and comments
- **Image Upload**: Drag-and-drop interface with S3 integration
- **Responsive Layout**: Works seamlessly on all devices

### 🔧 Backend Features
- **RESTful API**: Complete CRUD operations for all resources
- **File Storage**: AWS S3 integration with fallback to local storage
- **Authentication**: Secure JWT token system with refresh tokens
- **Database Seeding**: Sample data generation for development
- **Admin Panel**: Full Django admin interface

## API Endpoints

Here are the primary API endpoints currently available.

### Authentication
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `POST` | `/api/auth/register/`                      | Register a new user.                | Public               |
| `POST` | `/api/auth/login/`                         | Log in and receive JWTs.            | Public               |

### User Management
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/profiles/me/`                        | Get the current user's profile.     | User (Authenticated) |
| `PUT`  | `/api/profiles/me/`                        | Update the current user's profile.  | User (Authenticated) |

### Communities
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/communities/`                        | List all communities.               | User (Authenticated) |
| `GET`  | `/api/communities/<uuid>/`                 | Get specific community details.     | User (Authenticated) |
| `GET`  | `/api/communities/<uuid>/posts/`           | List approved posts in a community. | User (Authenticated) |

### Posts & Interactions
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/posts/`                              | List all posts.                     | User (Authenticated) |
| `POST` | `/api/posts/`                              | Create a new post.                  | User (Authenticated) |
| `POST` | `/api/posts/<uuid>/like/`                  | Like a post.                        | User (Authenticated) |
| `DELETE` | `/api/posts/<uuid>/like/`                 | Unlike a post.                      | User (Authenticated) |
| `GET`  | `/api/posts/<uuid>/comments/`              | List post comments.                 | User (Authenticated) |
| `POST` | `/api/posts/<uuid>/comments/`              | Create a comment.                   | User (Authenticated) |

### File Management
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `POST` | `/api/upload-image/`                       | Upload image to S3.                 | User (Authenticated) |

### Tags System
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/communities/<uuid>/tags/`            | List community tags.                | User (Authenticated) |
| `POST` | `/api/communities/<uuid>/tags/`            | Create a tag.                       | User (Authenticated) |
| `GET`  | `/api/communities/<uuid>/user-tags/`       | List user's assigned tags.          | User (Authenticated) |
| `POST` | `/api/user-tags/`                          | Assign tag to user.                 | User (Authenticated) |

### Contributions (formerly Scholarships)
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/contributions/`                      | List all contributions.             | User (Authenticated) |
| `GET`  | `/api/contributions/<uuid>/`               | Get contribution details.            | User (Authenticated) |
| `POST` | `/api/contributions/`                      | Create a new contribution.           | User (Authenticated) |
| `POST` | `/api/contributions/<uuid>/contribute/`    | Contribute to a fund.               | User (Authenticated) |

### Admin Endpoints
| Method | Endpoint                                   | Description                         | Authorization        |
| :----- | :----------------------------------------- | :---------------------------------- | :------------------- |
| `GET`  | `/api/admin/verifications/`                | List users pending verification.    | Admin                |
| `POST` | `/api/admin/verifications/<uuid>/approve/` | Approve a user's verification.      | Admin                |
| `GET`  | `/api/admin/posts/pending/`                | List posts pending moderation.      | Admin                |
| `POST` | `/api/admin/posts/<uuid>/approve/`         | Approve a pending post.             | Admin                |
| `POST` | `/api/admin/posts/<uuid>/reject/`          | Reject a pending post.              | Admin                |

---

## Recent Updates

### ✅ Completed Features
- **Social Media Functionality**: Like, comment, and share posts
- **Rich Text Editor**: Markdown support for posts and comments
- **Image Upload**: AWS S3 integration with drag-and-drop interface
- **Tag System**: Community-specific tags with user assignment
- **Smart Sharing**: Web Share API for mobile, clipboard for desktop
- **Responsive Design**: Mobile-first design with IIT Kharagpur branding
- **API Integration**: Complete frontend-backend integration
- **Database Seeding**: Sample data generation for development

### 🚧 Work Remaining

1. **Payment Gateway**: Integration for donations and contributions
2. **Real-time Messaging**: Direct messaging between alumni
3. **Profile Editing**: Frontend interface for profile updates
4. **Admin Dashboard**: Enhanced admin panel with analytics
5. **Credit Points System**: Gamification and reward system
6. **Email Notifications**: Automated email system for updates
7. **Search Functionality**: Advanced search across posts and users
8. **Mobile App**: React Native mobile application

### 🐛 Known Issues
- Some UI components need final polish
- Performance optimization for large datasets
- Cross-browser compatibility testing
- Mobile responsiveness fine-tuning

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
