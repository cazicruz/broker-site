# Endpoint Documentation For Task Posting API

## Resources

The resources provided by this API are listed as follows:


# API Documentation

This document provides Swagger documentation for the API endpoints exposed by the application.

## Users

### Get All Users
- **URL:** `/api/users`
- **Method:** `GET`
- **Description:** Get a list of all users.
- **Response:**
  - `200 OK`: Successfully retrieved users.
    - Response Body: Array of user objects.
  - `500 Internal Server Error`: Error getting users.

### Get User by ID
- **URL:** `/api/users/{id}`
- **Method:** `GET`
- **Description:** Get a user by their ID.
- **Parameters:**
  - `id` (Path Parameter) - The ID of the user.
- **Response:**
  - `200 OK`: User retrieved successfully.
    - Response Body: User object.
  - `400 Bad Request`: Missing route parameter `ID` or user not found.
  - `500 Internal Server Error`: Error getting user.

### Update User
- **URL:** `/api/users/{id}`
- **Method:** `PUT`
- **Description:** Update a user's information.
- **Parameters:**
  - `id` (Path Parameter) - The ID of the user.
- **Request Body:** JSON object with the following properties:
  - `username` (optional) - The new username.
  - `email` (optional) - The new email.
- **Response:**
  - `200 OK`: User updated successfully.
    - Response Body: Updated user object.
  - `400 Bad Request`: Missing route parameter `ID`, cannot update this user, or username or email is required.
  - `500 Internal Server Error`: Error updating user.

### Delete User
- **URL:** `/api/users/{id}`
- **Method:** `DELETE`
- **Description:** Delete a user by their ID.
- **Parameters:**
  - `id` (Path Parameter) - The ID of the user.
- **Response:**
  - `200 OK`: User deleted successfully.
    - Response Body: Deleted user object.
  - `400 Bad Request`: Missing route parameter `ID` or cannot delete this user.
  - `500 Internal Server Error`: Error deleting user.

### Perform Task
- **URL:** `/api/tasks/{taskId}`
- **Method:** `POST`
- **Description:** Perform a task associated with a user.
- **Parameters:**
  - `taskId` (Path Parameter) - The ID of the task.
- **Response:**
  - `200 OK`: Task done successfully.
    - Response Body: Task details.
  - `400 Bad Request`: Missing route parameter `ID`, user not found, task not found, user already did the task, or insufficient balance.
  - `500 Internal Server Error`: Error performing the task or funding referals.

## Reference Links

- [GitHub Repository](https://github.com/cazicruz/node_proj1)
- [API Documentation](/api-docs)

