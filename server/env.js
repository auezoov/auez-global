const dotenv = require('dotenv');
dotenv.config();

// MongoDB Atlas Connection String - using correct cluster
process.env.MONGODB_URI = 'mongodb+srv://admin:183349@cluster0.xkfg5yg.mongodb.net/computer_club?retryWrites=true&w=majority';

// Server Configuration
process.env.PORT = process.env.PORT || '5003';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
