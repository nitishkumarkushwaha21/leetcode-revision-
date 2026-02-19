# Server Setup Guide

## MongoDB Setup

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**:

   - Download from: https://www.mongodb.com/try/download/community
   - Or use package manager:

     ```bash
     # Windows (with Chocolatey)
     choco install mongodb

     # macOS (with Homebrew)
     brew install mongodb-community

     # Ubuntu/Debian
     sudo apt-get install mongodb
     ```

2. **Start MongoDB Service**:

   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb-community

   # Ubuntu/Debian
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**:
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create free MongoDB Atlas account**:

   - Go to: https://www.mongodb.com/atlas
   - Sign up for free tier
   - Create a cluster

2. **Get connection string**:

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update your .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rewear
   ```

### Option 3: Docker MongoDB

1. **Install Docker** (if not already installed)

2. **Run MongoDB container**:

   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo:latest
   ```

3. **Use local connection string**:
   ```
   MONGODB_URI=mongodb://localhost:27017/rewear
   ```

## Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/rewear

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS Configuration (optional for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

## Quick Start

1. **Install dependencies**:

   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables** (create .env file)

3. **Start MongoDB** (using one of the options above)

4. **Start the server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running**:

   ```bash
   # Windows
   net start | findstr MongoDB

   # macOS/Linux
   ps aux | grep mongod
   ```

2. **Test connection manually**:

   ```bash
   mongosh mongodb://localhost:27017/rewear
   ```

3. **Check MongoDB logs**:

   ```bash
   # Windows
   tail -f "C:\Program Files\MongoDB\Server\6.0\log\mongod.log"

   # macOS
   tail -f /usr/local/var/log/mongodb/mongo.log

   # Linux
   tail -f /var/log/mongodb/mongod.log
   ```

### Common Issues

1. **"bad auth : authentication failed"**:

   - MongoDB is not running
   - Wrong connection string
   - Authentication credentials incorrect

2. **"ECONNREFUSED"**:

   - MongoDB service not started
   - Wrong port (default is 27017)

3. **"MongoServerSelectionError"**:
   - Network connectivity issues
   - Firewall blocking connection

## Development Tips

1. **Use MongoDB Compass** (GUI tool):

   - Download from: https://www.mongodb.com/try/download/compass
   - Connect to: `mongodb://localhost:27017`

2. **Reset database**:

   ```bash
   # Connect to MongoDB shell
   mongosh

   # Switch to database
   use rewear

   # Drop all collections
   db.dropDatabase()
   ```

3. **View collections**:
   ```bash
   # In MongoDB shell
   show collections
   db.users.find()
   db.items.find()
   ```
