# Contact Identification API

## Overview
The **Contact Identification API** is a Node.js and Express-based application that helps manage and link customer contact information. It allows identifying, linking, and retrieving contact details based on email and phone numbers. The API uses **MongoDB** for data storage and supports **Swagger documentation** for better API management.

## Features
- Identify contacts using **email** or **phone number**
- Link multiple secondary contacts to a primary contact
- Prevent duplication of contact information
- Automatically assign primary or secondary status based on previous entries
- Supports **RESTful API** architecture
- Includes **Swagger documentation** for API reference

## Technologies Used
- **Node.js** (Express.js)
- **MongoDB** (Mongoose ODM)
- **Swagger UI** (API documentation)
- **Body-parser** (Handling request payloads)
- **Dotenv** (Environment variable management)
- **Nodemon** (Development automation)

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/download/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/downloads)

### Steps to Install
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/contact-identification-api.git
   cd contact-identification-api
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```sh
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/contactDB
   ```
4. Start the MongoDB server (if not already running):
   ```sh
   mongod --dbpath ./data
   ```
5. Run the application:
   ```sh
   npm start
   ```
6. The API will be available at: `http://localhost:3000`

## API Endpoints
### 1. **Identify Contact**
**Endpoint:** `POST /identify`

**Description:** Identifies or creates a contact based on email or phone number, linking contacts if necessary.

**Request Body:**
```json
{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

### 2. **Swagger Documentation**
**Endpoint:** `GET /api/identify`

Provides a **Swagger UI** interface for exploring the API.

## Project Structure
```
contact-identification-api/
│── controllers/
│   ├── contactController.js
│── models/
│   ├── Contact.js
│── routes/
│   ├── contactRoutes.js
│── .env
│── package.json
│── server.js
│── README.md
```

## Running the Application in Development Mode
To enable auto-restart on file changes, use:
```sh
npm run dev
```

## Contribution Guidelines
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'feat: added new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

## Contact
For questions or support, please contact:
- **Email:** utkarsh.jain2199@gmail.com
- **GitHub:** [https://github.com/Utkarsh-Jain2199/Identity_Reconciliation]
- **Demo Link:** [https://identity-reconciliation-bmmq.onrender.com/api/identify]

