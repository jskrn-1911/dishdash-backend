# DishDash Backend

## Overview
The backend for DishDash Helper, providing the core APIs for user authentication, order management, restaurant listings, and real-time updates. This backend is built using Node.js, Express.js, and MongoDB.

## Features
- **User Authentication**: Sign up, login, OTP-based verification.
- **Restaurant Listings**: Manage and display restaurants, dishes, and ratings.
- **Order Management**: Create and manage orders, track order status.
- **Real-Time Updates**: Use Socket.IO to send live updates for order status.
- **Payment Integration**: Integration with payment gateways like Razorpay and Stripe.
- **Admin Controls**: Admin can manage users, restaurants, and orders.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, OTP-based
- **Real-Time Communication**: Socket.IO
- **Payment Gateway**: Razorpay, Stripe
- **Deployment**: AWS, Docker (optional)

## Setup
1. Clone the repository:  
    `git clone https://github.com/yourusername/dishdash-backend.git`
2. Install dependencies:  
    `npm install`
3. Set environment variables in `.env` file (e.g., MongoDB URL, JWT secret).
4. Run the server:  
    `npm start`

## API Documentation
For a detailed API guide, check the `docs/` folder.

## Contributing
1. Fork the repo.
2. Create a feature branch.
3. Commit changes.
4. Submit a pull request.

## License
MIT License.
