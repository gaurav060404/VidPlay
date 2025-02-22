# VidPlay Backend

This is the backend for VidPlay, a YouTube-like video sharing platform.

## Features

- User registration and authentication
- Video upload and management
- Thumbnail and cover image upload
- Video views and statistics tracking
- User profile management

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Cloudinary for media storage
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance running
- Cloudinary account for media storage

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/VidPlay.git
    cd VidPlay
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:

    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    JWT_SECRET=your_jwt_secret
    MONGODB_URI=your_mongodb_uri
    ```

### Running the Application

1. Start the server:

    ```bash
    npm start
    ```

2. The server will be running on port 8000 : `http://localhost:8000`.

## API Endpoints

### Authentication

- `POST /register` - Register a new user
- `POST /login` - Login a user
- `POST /logout` - Logout a user
- `POST /refresh-token` - Refresh JWT token

### User Management

- `PATCH /update-avatar` - Update user avatar
- `PATCH /update-cover` - Update user cover image
- `PATCH /update-details` - Update user details
- `PATCH /change-password` - Change user password

### Video Management

- `POST /upload-video` - Upload a new video
- `GET /videos` - Get all videos
- `GET /videos/:id` - Get a specific video
- `PATCH /videos/:id` - Update a video
- `DELETE /videos/:id` - Delete a video

## Data Model

- [Data Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.