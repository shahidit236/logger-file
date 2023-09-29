
const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./models/User');
const User = require('./models/User');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 1000, 
    },
  })
);

// User registration route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, address, city, pincode, state,  deviceIP, device, location } = req.body;

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

 
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      city,
      pincode,
      state,
    });

    // const logMessage = `Registration Time: ${new Date().toLocaleString()}\nUser: ${JSON.stringify(newUser)}\n`;
    const logMessage = `Registration Time: ${new Date().toLocaleString()}\nUser: ${JSON.stringify(newUser)}\nDevice IP: ${deviceIP}\nDevice: ${device}\nLocation: ${location}\n`;
    fs.appendFile('logs/registration.log', logMessage, (err) => {
      if (err) {
        console.error('Error writing to login log file:', err);
      }
    });

    // res.json({ message: 'User logged in successfully!', newUser });


    res.json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});

// User login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }


    const isMatch = bcrypt.compare(password, user.password);


    if (!isMatch) {
      throw new Error('Incorrect password');
    }


    req.session.userId = user.id;


    const logMessage = `Login Time: ${new Date().toLocaleString()}\nUser: ${JSON.stringify(user)}\nSession ID: ${req.sessionID}\n`;
    fs.appendFile('logs/login.log', logMessage, (err) => {
      if (err) {
        console.error('Error writing to login log file:', err);
      }
    });

    res.json({ message: 'User logged in successfully!', user });

    // End the session after 5 seconds
    // setTimeout(() => {
    //   req.session.destroy((err) => {
    //     if (err) {
    //       console.error('Error destroying session:', err);
    //     } else {
    //       console.log('Session expired and destroyed');
    //     }
    //   });
    // }, 5000);
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(401).json({ message: error.message });
  }
});


// Logout API endpoint
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ message: 'Error logging out' });
    } else {
      console.log('Session expired and destroyed');
      res.json({ message: 'Logout successful!' });
    }
  });
});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

