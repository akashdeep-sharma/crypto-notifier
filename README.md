# Crypto Price Tracker and Swap Service

This project is a NestJS application that tracks cryptocurrency prices, provides swap rates, and sends alerts for price changes.

## Features

- Track prices for Ethereum and Polygon
- Get swap rates from ETH to BTC
- Set price alerts
- Hourly price checks and notifications

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL database

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/crypto-price-tracker.git
   cd crypto-price-tracker
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   MORALIS_API_KEY=your_moralis_api_key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@example.com
   ```

   Replace the values with your actual database URL, Moralis API key, and email service credentials.

## Running the application

1. Start the application in development mode:

   ```
   npm run start:dev
   ```

2. The application will be available at `http://localhost:3000`

3. Access the Swagger API documentation at `http://localhost:3000/api`

## API Endpoints

- `GET /prices/:chain/hourly`: Get hourly prices for the last 24 hours
- `POST /alerts`: Set a price alert
- `GET /swap/eth-to-btc`: Get swap rate from ETH to BTC

For detailed API documentation, refer to the Swagger UI at `/api`.

## Testing

Run unit tests:
