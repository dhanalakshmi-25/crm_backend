const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc   Register new user
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('req:'.req)

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'telecaller',
    });

    const token = generateToken(user);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

// @desc   Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("email psss" ,email ,password);
  
  try {
    const user = await User.findOne({ email });

    console.log("user------->" ,user);

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
};
