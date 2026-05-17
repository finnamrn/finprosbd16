const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectRedis } = require('./src/config/redis')
require('dotenv').config();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/upload', require('./src/routes/upload'))

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/messages', require('./src/routes/messageRoutes'));

app.get('/', (req, res) => {
    res.send('EchoDrop API is running!');
});

const PORT = process.env.PORT || 5000;

connectRedis()

app.listen(PORT, () => {
    console.log(`Server EchoDrop berjalan di port ${PORT}`);
});