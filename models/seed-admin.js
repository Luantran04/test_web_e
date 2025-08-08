// seed-admin.js
const mongoose = require('mongoose');
const User = require('./models/user.model.js');
require('dotenv').config();

const username = 'admin';
const password = 'Password123!'; // Mật khẩu tạm thời, bạn nên đổi sau khi đăng nhập

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Kết nối DB để seed admin...");

        // Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ username });
        if (existingAdmin) {
            console.log('Tài khoản admin đã tồn tại.');
            mongoose.connection.close();
            return;
        }

        // Tạo user mới
        const adminUser = new User({ username, password });
        await adminUser.save();
        console.log('Tạo tài khoản admin thành công!');
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Lỗi khi seed admin:', error);
        mongoose.connection.close();
    }
};

seedAdmin();