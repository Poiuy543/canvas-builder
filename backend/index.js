const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const canvasRoutes = require('./routes/canvas.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        'https://canvas-builder-frontend.onrender.com',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));



app.use(bodyParser.json());

app.use('/api/canvas', canvasRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});