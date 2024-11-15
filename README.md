# Car Management Application

## Overview
This project is a Car Management Application that allows users to create, view, edit, and delete cars. Each car entry can contain up to 10 images, a title, a description, and tags (such as car type, company, dealer, etc.). The application includes user authentication, ensures users can only manage their own products, and provides search functionality across products.

## Features
1. **User Authentication**: Users can sign up and log in to manage their car listings.
2. **Add Car**: Users can add a car with up to 10 images, title, description, and tags.
3. **View Cars**: Users can view a list of all their cars.
4. **Global Search**: Users can search across all their cars using keywords that match the title, description, or tags.
5. **Car Details**: Users can click on a car to view its details.
6. **Update Car**: Users can update a car’s title, description, tags, or images.
7. **Delete Car**: Users can delete a car.

## Frontend Requirements
1. **Sign Up / Login Page**: Allows users to register and log in to access their cars.
2. **Car List Page**: Displays all cars created by the logged-in user with a search bar.
3. **Car Creation Page**: Provides a form for uploading images, setting a title, and writing a description for a new car.
4. **Car Detail Page**: Displays a car’s details with options to edit or delete it.

## API Endpoints
1. **Create User**: `POST /api/users`
2. **Create Car**: `POST /api/cars`
3. **List Cars**: `GET /api/cars`
4. **Get Car**: `GET /api/cars/:id`
5. **Update Car**: `PUT /api/cars/:id`
6. **Delete Car**: `DELETE /api/cars/:id`


## Tech Stack
- **Frontend**: ReactJS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Storage**: Cloudinary for image storage
- **Deployment**: Deployed on Netlify

## Deployment
The application is deployed and can be accessed at [Deployment Link](https://glistening-caramel-75e27d.netlify.app/).

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB database
- Cloudinary account for image storage
