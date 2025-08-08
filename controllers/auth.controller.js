// controllers/auth.controller.js
const User = require('../models/user.model.js'); // Đã sửa đường dẫn ở đây

// Hiển thị trang đăng nhập
const getLoginPage = (req, res) => {
    // Truyền vào một biến error, ban đầu là null
    // để file ejs không bị lỗi khi render lần đầu
    res.render('admin/login', { error: null });
};

// Xử lý logic đăng nhập
const handleLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Tìm user trong database bằng username
        const user = await User.findOne({ username: username });
        if (!user) {
            // Nếu không tìm thấy user, render lại trang login với thông báo lỗi
            return res.render('admin/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Nếu mật khẩu không khớp, render lại trang login với thông báo lỗi
            return res.render('admin/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
        }

        // 3. Đăng nhập thành công: Lưu thông tin user vào session
        // Session sẽ giúp server "nhớ" user này đã đăng nhập
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
    // Hủy session
    req.session.destroy(err => {
        if (err) {
            // Nếu có lỗi, vẫn ở lại trang admin để user biết
            return res.redirect('/admin/dashboard');
        }
        // Xóa cookie session khỏi trình duyệt
        res.clearCookie('connect.sid');
        // Chuyển hướng về trang đăng nhập
        res.redirect('/admin/login');
    });
};

module.exports = {
    getLoginPage,
    handleLogin,
    handleLogout
};
