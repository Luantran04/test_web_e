// models/seed-admin.js

const mongoose = require('mongoose');
const User = require('./models/user.model.js'); // Sửa đường dẫn ở đây
require('dotenv').config();

const username = 'admin';
const password = 'Password123!'; // Mật khẩu tạm thời, bạn nên đổi sau khi đăng nhập

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Kết nối DB để tạo tài khoản admin...");

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ username: username });
        if (existingAdmin) {
            console.log('Tài khoản admin đã tồn tại.');
            mongoose.connection.close();
            return;
        }

        // Tạo user mới
        const adminUser = new User({ username: username, password: password });
        await adminUser.save();
        console.log('Tạo tài khoản admin thành công!');
        console.log(`> Tên đăng nhập: ${username}`);
        console.log(`> Mật khẩu: ${password}`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản admin:', error);
        mongoose.connection.close();
    }
};

seedAdmin();
