const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const secretKey = 'SC_KEY'; // Replace with a secure secret key



// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin of your frontend application
  credentials: true // Allow credentials (e.g., cookies)
}));
app.use(bodyParser.json());

// Connect to MongoDB using dotenv

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Define message schema
const messageSchema = new mongoose.Schema({
  message: String,
});
const Message = mongoose.model('Message', messageSchema);

// POST route to handle incoming messages
  app.post('/send-message', async (req, res) => {
    const messageText = req.body.message;
    console.log('Received message:', messageText);
    
    // Save message to MongoDB
    const message = new Message({ message: messageText });
    await message.save();

    res.send({ success: true, message: 'Message received and saved successfully.' });
  });

// Define Register schema
const registerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Register = mongoose.model('Register', registerSchema);

// POST route to handle user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration details:', { username, email, password });
  
  try {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds parameter

    // Save registration details to MongoDB with hashed password
    const newUser = new Register({
      username,
      email,
      password: hashedPassword // Save hashed password
    });

    await newUser.save();
    res.status(200).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error saving registration details:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
// GET route to retrieve all messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET route to retrieve all user registration details
app.get('/register', async (req, res) => {
  try {
    const registrations = await Register.find(); // Assuming Register is your model for user registrations
    res.json(registrations);
  } catch (error) {
    console.error('Error retrieving user registrations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// POST route to handle user login
app.post('/login', async (req, res) => {                            
  const { email, password } = req.body;
  try {
    // Check if user exists in the database
    const user = await Register.findOne({ email });

    // Generate JWT token with user data and sign it with the secret key
    jwt.sign({ user }, secretKey, { expiresIn: '1h' }, async (err, token) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (user) {
          // Compare passwords
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            // Passwords match, send success response with token
            res.status(200).json({ success: true, message:
              + 'Login successful.', token });
            console.log('Login successful for user:', email); 
          } else {
            // Passwords don't match, send error response
            res.status(403).json({ success: false, error: 'Invalid email or password.' });
            console.log('Invalid email or password.'); 
          }
        } else {
          // User not found or incorrect email, send error response
          res.status(404).json({ success: false, error: 'Invalid email or password.' });
          console.log('Invalid user'); 
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


// Middleware to verify JWT token
function verifyToken(req, res, next) {
  // Get token from Authorization header
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.user = decoded.user;
    next();
  });
}

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});




// Start the server
const PORT = process.env.PORT || 3001; // Use PORT from environment variable or default to 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
