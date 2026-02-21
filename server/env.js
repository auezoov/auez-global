const dotenv = require('dotenv');
dotenv.config();

// MongoDB Atlas Connection String - using correct cluster
process.env.MONGODB_URI = 'mongodb+srv://admin:183349@cluster0.xkfg5yg.mongodb.net/auezdb?retryWrites=true&w=majority';

// Server Configuration
process.env.PORT = process.env.PORT || '10000';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Telegram Bot Configuration
process.env.TELEGRAM_BOT_TOKEN = '8404137291:AAHEyIuigot3KraCJNgU5a5DQrg3d9asYbs';
process.env.TELEGRAM_BOT_NAME = 'Auez_club_bot';
