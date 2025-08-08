// app.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

// --- KẾT NỐI DATABASE ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Kết nối MongoDB thành công!'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// --- CẤU HÌNH MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Thư mục public sẽ được tạo sau
app.set('view engine', 'ejs');

// --- CẤU HÌNH SESSION ---
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Cookie tồn tại trong 1 ngày
    }
}));


// --- ROUTES ---
const adminRoutes = require('../routes/admin.routes.js');
app.use('/admin', adminRoutes);

// Route gốc để kiểm tra server có hoạt động không
app.get('/', (req, res) => {
    res.send('Trang chủ của website trắc nghiệm');
});


// --- KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});