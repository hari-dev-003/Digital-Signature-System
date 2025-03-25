const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5174', // Allow requests from frontend origin
  methods: 'POST,GET,OPTIONS,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(require('express-fileupload')()); // Enable file upload middleware

// MongoDB Connection
mongoose.connect('mongodb+srv://2k23cse053:database@d-signature-system.tedit.mongodb.net/?retryWrites=true&w=majority&appName=D-signature-system', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Digital Signature System Backend is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
