const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require("../modal/user")

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Invalid access token'
            })

            const DataUser = await User.findById(decode._id);


            if (DataUser.isBlocked) {
                return res.status(403).json({
                    success: false,
                    mes: "Tài khoản đã bị khoá"
                })
            } else {
                req.user = decode
                next();
            }


        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Yêu cầu đăng nhập!!!'
        })
    }
})

const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (role == "1945")
        return res.status(401).json({
            success: false,
            mes: ' REQUIRE ADMIN ROLE'
        })
    next();
})

module.exports = {
    verifyAccessToken,
    isAdmin
}