const User = require('../modal/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt.js')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid');
const sendMail = require('../ultils/sendMail')

const crypto = require('crypto')

class UserController {

    // register = asyncHandler(async (req, res) => {
    //     const { email, password, name } = req.body
    //     if (!email || !password || !name)
    //         return res.status(400).json({
    //             sucess: false,
    //             mes: 'Thiếu đầu vào'
    //         })
    //     const user = await User.findOne({ email })
    //     if (user) throw new Error('Người dùng đã tồn tại')
    //     else {
    //         const newUser = await User.create(req.body)
    //         return res.status(200).json({
    //             sucess: newUser ? true : false,
    //             mes: newUser ? 'Đăng kí thành công. Vui lòng đăng nhập' : 'Đã có lỗi xảy ra'
    //         })
    //     }
    // })
    // Refresh token => Cấp mới access token
    // Access token => Xác thực người dùng, quân quyên người dùng

    register = asyncHandler(async (req, res) => {
        const { email, password, name } = req.body
        if (!email || !password || !name)
            return res.status(400).json({
                sucess: false,
                mes: 'Thiếu đầu vào'
            })
        const user = await User.findOne({ email })
        if (user) throw new Error('Người dùng đã tồn tại')

        const token = uniqid();
        // lưu data body và cookie
        res.cookie('dataRegister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 });

        const html = `Xin vui lòng click vào link dưới đây để hoàn tất đăng kí.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
         <a href=${process.env.SERVER_URL}/api/user/finalRegister/${token}>Click here</a>`
        const data = {
            email,
            html,
            subject: "Hoàn tất đăng kí Shop Điện tử DUNGNV"
        }
        const rs = await sendMail(data);
        return res.status(200).json({
            success: true,
            mes: "Vui lòng check email để hoàn tất đăng kí",
        })
    })

    finalRegister = asyncHandler(async (req, res) => {
        const data = req.cookies["dataRegister"];
        const { token } = req.params;
        if (!data || token != data.token) {
            return res.redirect(`${process.env.CLIENT_URL}/finalRegister/0`)
        }

        const newUser = await User.create({
            name: data.name,
            email: data.email,
            password: data.password,
            mobile: data.mobile
        })

        if (newUser) {
            res.clearCookie('dataRegister');
            return res.redirect(`${process.env.CLIENT_URL}/finalRegister/1`)
        } else {
            return res.redirect(`${process.env.CLIENT_URL}/finalRegister/0`)
        }
        // return res.status(200).json({
        //     sucess: newUser ? true : false,
        //     mes: newUser ? 'Đăng kí thành công. Vui lòng đăng nhập' : 'Đã có lỗi xảy ra'
        // })
    })

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({
                sucess: false,
                mes: 'Thiếu đầu vào'
            })
        // plain object
        const response = await User.findOne({ email })
        if (response && await response.isCorrectPassword(password)) {
            // Tách password và role ra khỏi response
            const { password, role, refreshToken, ...userData } = response.toObject()
            // Tạo access token
            const accessToken = generateAccessToken(response._id, role)
            // Tạo refresh token
            const newRefreshToken = generateRefreshToken(response._id)
            // Lưu refresh token vào database
            await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
            // Lưu refresh token vào cookie
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.status(200).json({
                sucess: true,
                accessToken,
                userData
            })
        } else {
            throw new Error('Invalid credentials!')
        }
    })

    getCurrent = asyncHandler(async (req, res) => {
        console.log(req.user);
        const { _id } = req.user
        const user = await User.findById(_id).select('-refreshToken -password -role')
        return res.status(200).json({
            success: user ? true : false,
            rs: user ? user : 'Không tìm thấy người dùng'
        })
    })

    refreshAccessToken = asyncHandler(async (req, res) => {
        // Lấy token từ cookies
        const cookie = req.cookies
        console.log(cookie);
        // Check xem có token hay không
        if (!cookie && !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookies')
        // Check token có hợp lệ hay không
        const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_REFRESH_SECRET)
        const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
        return res.status(200).json({
            success: response ? true : false,
            newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched'
        })
    })

    logout = asyncHandler(async (req, res) => {
        const cookie = req.cookies
        if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookies')
        // Xóa refresh token ở db
        await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
        // Xóa refresh token ở cookie trình duyệt
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.status(200).json({
            success: true,
            mes: 'Đăng xuất thành công'
        })
    })

    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.query
        console.log(email)
        if (!email) throw new Error('Thiếu email')
        const user = await User.findOne({ email })
        if (!user) throw new Error('Không tìm thấy người dùng')
        const resetToken = user.createPasswordChangedToken()
        await user.save()

        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.SERVER_URL}/api/user/reset-password/${resetToken}>Click here</a>`

        const data = {
            email,
            html, subject: "Quên mật khẩu"
        }
        const rs = await sendMail(data)
        return res.status(200).json({
            success: true,
            rs
        })
    })

    resetPassword = asyncHandler(async (req, res) => {
        const { password, token } = req.body
        if (!password || !token) throw new Error('Thiếu đầu vào')
        const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
        const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
        if (!user) throw new Error('Reset Token không hợp lệ')
        user.password = password
        user.passwordResetToken = undefined
        user.passwordChangedAt = Date.now()
        user.passwordResetExpires = undefined
        await user.save()
        return res.status(200).json({
            success: user ? true : false,
            mes: user ? 'Đổi mật khẩu thành công' : 'Đã có lỗi xảy ra'
        })
    })

    getAllUsers = asyncHandler(async (req, res) => {
        const response = await User.find().select('-refreshToken -password -role')
        return res.status(200).json({
            success: response ? true : false,
            users: response
        })
    })

    deleteUser = asyncHandler(async (req, res) => {
        const { _id } = req.query
        if (!_id) throw new Error('Missing inputs')
        const response = await User.findByIdAndDelete(_id)
        return res.status(200).json({
            success: response ? true : false,
            deletedUser: response ? `Người dùng với email ${response.email} đã xoá` : 'Không tìm thấy người dùng'
        })
    })

    updateUser = asyncHandler(async (req, res) => {
        // 
        const { _id } = req.user
        if (!_id || Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào')
        const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role -refreshToken')
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Đã có lỗi xảy ra'
        })
    })

    updateUserByAdmin = asyncHandler(async (req, res) => {
        const { uid } = req.params
        if (Object.keys(req.body).length === 0) throw new Error('Thiếu đầu vào')
        const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Đã có lỗi xảy ra'
        })
    })

    updateCart = asyncHandler(async (req, res) => {
        const { _id } = req.user;

        const check = await User.findOne({
            _id: _id,
            cart: {
                $elemMatch: {
                    color: req.body.color,
                    size: req.body.size
                }
            }
        });


        if (check) {
            return res.json("Sản phẩm đã tồn tại");
        }

        const user = await User.findByIdAndUpdate(_id, { $push: { cart: req.body } }, { new: true })

        res.status(200).json(user);
    })


}
module.exports = new UserController;