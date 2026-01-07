// /api/login.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connectToDatabase } = require('./utils/mongodb');
const User = require('./models/userModel');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      await connectToDatabase(); // MongoDB'ye bağlan
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Yanlış şifre.' });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ success: true, message: 'Giriş başarılı!', token });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Yalnızca POST istekleri kabul edilir.' });
  }
};
