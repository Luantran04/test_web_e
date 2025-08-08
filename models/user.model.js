// models/user.model.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true // Xóa khoảng trắng ở đầu và cuối
    },
    password: {
        type: String,
        required: true
    }
});

// Hash mật khẩu trước khi lưu vào database
userSchema.pre('save', async function(next) {
    // Chỉ hash mật khẩu nếu nó được thay đổi (hoặc là người dùng mới)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Tạo một "salt" để tăng cường bảo mật
        this.password = await bcrypt.hash(this.password, salt); // Hash mật khẩu với salt
        next();
    } catch (error) {
        next(error);
    }
});

// Thêm một phương thức để so sánh mật khẩu đã nhập với mật khẩu đã hash trong DB
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;