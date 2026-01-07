// /api/register.js
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('./utils/mongodb');
const User = require('./models/userModel');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await connectToDatabase(); // MongoDB'ye bağlan
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      await newUser.save();
      res.status(200).json({ success: true, message: 'Kayıt başarılı!' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Kayıt sırasında hata oluştu.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Yalnızca POST istekleri kabul edilir.' });
  }
};
