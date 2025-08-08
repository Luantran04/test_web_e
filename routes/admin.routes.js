// routes/admin.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// GET /admin/login -> Hiển thị trang đăng nhập
router.get('/login', authController.getLoginPage);

// POST /admin/login -> Xử lý thông tin đăng nhập
router.post('/login', authController.handleLogin);

// GET /admin/logout -> Xử lý đăng xuất
router.get('/logout', authController.handleLogout);


// Một route dashboard tạm thời để kiểm tra
// Chúng ta sẽ bảo vệ route này trong bước tiếp theo
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/admin/login');
    }
    res.send(`<h1>Chào mừng, ${req.session.username}!</h1><a href="/admin/logout">Đăng xuất</a>`);
});

module.exports = router;