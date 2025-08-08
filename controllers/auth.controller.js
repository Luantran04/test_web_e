// controllers/auth.controller.js
const User = require('./models/user.model.js');

// Hiển thị trang đăng nhập
const getLoginPage = (req, res) => {
    res.render('admin/login', { error: null }); // Truyền error là null ban đầu
};

// Xử lý logic đăng nhập
const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Tìm user trong database
        const user = await User.findOne({ username });
        if (!user) {
            // Nếu không tìm thấy user
            return res.render('admin/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Nếu mật khẩu không khớp
            return res.render('admin/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 3. Đăng nhập thành công -> Lưu thông tin user vào session
        req.session.userId = user._id;
        req.session.username = user.username;

        // 4. Chuyển hướng đến trang dashboard của admin
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error(error);
        res.render('admin/login', { error: 'Đã có lỗi xảy ra, vui lòng thử lại.' });
    }
};

// Xử lý đăng xuất
const handleLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin/dashboard'); // Nếu lỗi, vẫn ở lại trang admin
        }
        res.clearCookie('connect.sid'); // Xóa cookie session
        res.redirect('/admin/login'); // Chuyển hướng về trang đăng nhập
    });
};

module.exports = {
    getLoginPage,
    handleLogin,
    handleLogout
};