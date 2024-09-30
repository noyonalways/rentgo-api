<div align="center">

[![Youtube][youtube-shield]][youtube-url]
[![Facebook][facebook-shield]][facebook-url]
[![Facebook Page][facebook-shield]][facebook-group-url]
[![Instagram][instagram-shield]][instagram-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![VS Code Theme][vscode-shield]][vscode-theme-url]
[![NPM Package][npm-shield]][npm-package-url]

</div>

<!-- PROJECT LOGO -->

<br />
<div align="center">
  <a href="https://github.com/noyonalways/rentgo-api">
    <img src="https://i.ibb.co.com/PjBr32F/car.png" alt="Logo" width="80" height="80">
  </a>
  <h3 align="center">RentGo Api</h3>
    <p align="center">
      Reservation System for booking Car's
    <br />
    <a href="https://rentgo-api.noyonrahman.xyz">
      <strong>Live Server Link »</strong>
    </a>
    
[![OverView Video][overview-video-shield]][overview-video-url]
[![Postman API DOC][postman-shield]][postman-api-doc-url]

  </p>
</div>

## Overview:

The **RentGo** Car Rental Reservation System is a powerful booking system designed for cars rental purposes. User Authentication, car management and booking functionalities. The system contains roles (admin and user) with role-related access controls which allows for an orderly chain of operations, at the same time being fail-safe.

## Features:

### Authentication

- Sign Up `/api/v1/auth/signup` - **POST**: Allows new users to register by providing necessary details like name, email, password, phone number, and address.
- Sign In `/api/v1/v1/auth/signin` - **POST**: Allows registered users to log in using their email and password. Upon successful authentication, a JWT token is issued for subsequent requests and send as response.
- Get Me `/api/v1/me` - **GET**: Get logged in user details
- Update User Profile `/api/v1/update-profile` - **PATCH**: Update logged in user profile
- Generate a new access token from refresh token `/api/v1/refresh-token` - **POST**: Generate a new access token from refresh token via cookies

## User Management

- Get all users `/api/v1/users` - **GET**: Get all users (admin only)
- Block and Unblock a user `/api/v1/users/:userId/change-status` - **PATCH**: Update the user status (admin only)
- Make User to Admin `/api/v1/users/:userId/make-admin` - **PATCH**: Make a normal user to Admin (admin only)

### Car Management

- Create a Car `/api/v1/cars` - **POST**: Enables administrators to add new car. Details required include the car's `name`, `description`, `color`, `features`, and `pricePerHour`.
- Get All Cars `/api/v1/cars` - **GET**: Allows users and administrators to retrieve a list of all available cars. This endpoint provides comprehensive details about each car.
- Get a Car `/api/v1/cars/:id` - **GET**: Enables users and administrators to view detailed information about a specific car identified by its Id.
- Update a Car `/api/v1/cars/:id` - **PUT**: Allows administrators to update the details of an existing car, such as its description, features, or status.
- Delete a Car `/api/v1/cars/:id` - **DELETE**: Performs a soft delete of a car, making it unavailable for bookings without permanently removing it from the database. This operation is restricted to administrators.

### Booking Management

- Get All Bookings `/api/v1/booking` - **GET**: Provides administrators with a comprehensive list of all bookings made by users. This is useful for managing and monitoring booking activities.
- Book a Car `/api/v1/booking` - **POST**: Allows users to book a car for a specified period. The booking details include the car ID, user ID, and rental duration.
- Get User's Bookings `/api/v1/booking/my-bookings` - **GET**: Enables users to view their booking history, helping them keep track of their rentals.
- Return the Car `/api/v1/cars/return` - **PUT**: Admins can mark a car as returned once the rental period is over, making it available for future bookings.
- Get booking details after payment `/api/v1/bookings/my-bookings/:transactionId` - **GET**: Get logged in user booking after payment by transaction Id
- Cancel a booking while booking is pending `/api/v1/bookings/my-bookings/:id` - **DELETE**: Logged in user can cancel a booking while booking is pending
- Update a booking while booking is in pending `/api/v1/bookings/my-bookings/:id` **PATCH**: Update a booking while booking is pending
- Approve a booking `/api/v1/bookings/:id/approved` **PATCH**: Approve a booking by booking id (admin only)
- Cancel a booking `/api/v1/bookings/:id/cancelled` **PATCH**: Cancel a booking by booking id (admin only)

## Payments Management

- Get all payments info `/api/v1/payments` **GET**: Get all payments (admin only)
- Make payment `/api/v1/payments/pay` **POST**: Make payment after the car is returned
- Get logged in user payments `/api/v1/payments/my-payments` **GET**: Get all payments for logged in user
- Check payment confirmation `/api/v1/payments/confirmation` **POST**
- Payment filed `/api/v1/payments/failed` **POST**
- Payment cancelled`/api/v1/payments/cancelled` **GET**

### Access Control

- **Admin**: Has full control over car management, including creating, updating, and deleting cars. Admins can also manage all bookings and return cars.
- **User**: Can view available cars, make bookings, and view their booking history.

## 🛠️ Technology Stack:

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- **Zod**: TypeScript-first schema declaration and validation library.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-001E4E?style=for-the-badge&logo=zod&logoColor=white)

## 💻 Running locally:

To run the this project locally, follow these steps:

### 1. Clone the repository from GitHub:

```sh
git clone https://github.com/noyonalways/rentgo-api.git
```

### 2. Navigate into the project directory:

```sh
cd rentgo-api
```

### 3. Install Dependencies (npm or yarn):

```sh
npm install
```

or

```sh
yarn
```

### 4. Set up environment variables:

- Create a `.env` file in the root directory.
- Define necessary environment variables such as database connection URL, PORT, etc. Refer to any provided `.env.example` file or documentation for required variables.

```sh
# app configuration
PORT=your_port
DATABASE_URL=your_database_url
NODE_ENV=node_environment
JWT_ACCESS_TOKEN_SECRET=jwt_access_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=jwt_access_token_secret_expires_time
JWT_REFRESH_TOKEN_SECRET=jwt_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=jwt_refresh_token_expires_time
BCRYPT_SALT_ROUND=bcrypt_salt_round

# client and server urls
API_BASE_URL=your_api_base_url
CLIENT_BASE_URL=your_client_base_url

# payment gateway configuration
AAMARPAY_GATEWAY_BASE_URL=aamarpay_gateway_base_url
AAMARPAY_STORE_ID=_aamarpay_store_id
AAMARPAY_SIGNATURE_KEY=aamarpay_signature_key
```

### 4. Run the Application:

```sh
npm run dev
```

or

```sh
yarn dev
```

## Contact:

- Email: [noyonrahman2003@gmail.com](mailto:noyonrahman2003@gmail.com)
- LinkedIn: [Noyon Rahman](https://linkedin.com/in/noyonalways)

[youtube-shield]: https://img.shields.io/badge/-Youtube-black.svg?style=round-square&logo=youtube&color=555&logoColor=white
[youtube-url]: https://youtube.com/@deskofnoyon
[facebook-shield]: https://img.shields.io/badge/-Facebook-black.svg?style=round-square&logo=facebook&color=555&logoColor=white
[facebook-url]: https://facebook.com/noyonalways
[facebook-group-url]: https://facebook.com/webbronoyon
[instagram-shield]: https://img.shields.io/badge/-Instagram-black.svg?style=round-square&logo=instagram&color=555&logoColor=white
[instagram-url]: https://instagram.com/noyonalways
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=round-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/noyonalways
[vscode-shield]: https://img.shields.io/badge/-VS%20Code%20Theme-black.svg?style=round-square&logo=visualstudiocode&colorB=555
[vscode-theme-url]: https://marketplace.visualstudio.com/items?itemName=noyonalways.codevibe-themes
[npm-shield]: https://img.shields.io/badge/-Package-black.svg?style=round-square&logo=npm&color=555&logoColor=white
[npm-package-url]: https://www.npmjs.com/package/the-magic-readme
[postman-shield]: https://img.shields.io/badge/-Postman_API_DOC-black.svg?style=round-square&logo=postman&color=555
[postman-api-doc-url]: https://documenter.getpostman.com/view/20724567/2sA3XV8esS
[overview-video-shield]: https://img.shields.io/badge/-Overview_Video-black.svg?style=round-square&logo=youtube&color=555&logoColor=c4302b
[overview-video-url]: https://youtu.be/J4QolLkmus4
