const User = require('../modal/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt.js')
const jwt = require('jsonwebtoken')
const uniqid = require('uniqid');
const sendMail = require('../ultils/sendMail')
const makeToken = require("../ultils/maketoken.js")
const crypto = require('crypto');

const Order = require('../modal/order');
const Product = require('../modal/product');

class UserController {
    // truyền thống
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

    // xác thực email 
    // register = asyncHandler(async (req, res) => {
    //     const { email, password, name } = req.body
    //     if (!email || !password || !name)
    //         return res.status(400).json({
    //             sucess: false,
    //             mes: 'Thiếu đầu vào'
    //         })
    //     const user = await User.findOne({ email })
    //     if (user) throw new Error('Người dùng đã tồn tại')

    //     const token = uniqid();
    //     // lưu data body và cookie
    //     res.cookie('dataRegister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 });

    //     const html = `Xin vui lòng click vào link dưới đây để hoàn tất đăng kí.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
    //      <a href=${process.env.SERVER_URL}/api/user/finalRegister/${token}>Click here</a>`
    //     const data = {
    //         email,
    //         html,
    //         subject: "Hoàn tất đăng kí Shop Điện tử DUNGNV"
    //     }
    //     const rs = await sendMail(data);
    //     return res.status(200).json({
    //         success: true,
    //         mes: "Vui lòng check email để hoàn tất đăng kí",
    //     })
    // })

    //   finalRegister = asyncHandler(async (req, res) => {
    //     const data = req.cookies["dataRegister"];
    //     const token = req.params.token;
    //     console.log(token);
    //     console.log(data);
    //     if (!data || token !== data.token) {
    //         res.clearCookie('dataRegister');
    //         return res.redirect(`${process.env.CLIENT_URL}/finalRegister/0`)
    //     }

    //     const newUser = await User.create({
    //         name: data.name,
    //         email: data.email,
    //         password: data.password,
    //         mobile: data.mobile
    //     })
    //     if (newUser) {
    //         res.clearCookie('dataRegister');
    //         return res.redirect(`${process.env.CLIENT_URL}/finalRegister/1`)
    //     } else {
    //         res.clearCookie('dataRegister');
    //         return res.redirect(`${process.env.CLIENT_URL}/finalRegister/0`)
    //     }
    // })


    // xác thực email theo code
    register = asyncHandler(async (req, res) => {
        const { email, password, name, mobile } = req.body
        if (!email || !password || !name || !mobile)
            return res.status(400).json({
                sucess: false,
                mes: 'Thiếu đầu vào'
            })
        const user = await User.findOne({ email })
        if (user) throw new Error('Người dùng đã tồn tại')

        const token = makeToken(10);
        const emailEdi = btoa(email) + "@" + token;
        // lưu data body và cookie
        const newUser = await User.create({
            email: emailEdi, password, name, mobile
        })

        if (newUser) {
            const html = `<h2>Mật khẩu đăng kí</h2></br><blockquite>${token}</blockquite>`
            const data = {
                email,
                html,
                subject: "Xác nhận đăng kí account tại SHOP Điện tử DUNGNV"
            }
            const rs = await sendMail(data);
        }
        setInterval(async () => {
            await User.deleteOne({ email: emailEdi });
        }, [15 * 60 * 1000])

        return res.status(200).json({
            success: true,
            mes: "Vui lòng check code trong email để hoàn tất đăng kí",
        })
    })

    finalRegister = asyncHandler(async (req, res) => {
        const token = req.params.token;

        function escapeRegex(str) {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        const re = new RegExp('@' + escapeRegex(token) + '$', 'i'); // 'i' nếu muốn không phân biệt hoa thường

        const users = await User.find({ email: { $regex: re } });

        if (users.length == 0) {
            throw new Error('Mã đăng kí đã hết hạn hoặc không chính xác!')
        } else {

            users[0].email = atob(users[0]?.email?.split('@')[0]);
            users[0].save();
        }

        return res.status(200).json({
            success: true,
            mes: "Đăng kí thành công",
        })



        // const newUser = await User.create({
        //     name: data.name,
        //     email: data.email,
        //     password: data.password,
        //     mobile: data.mobile
        // })
        // if (newUser) {
        //     res.clearCookie('dataRegister');
        //     return res.redirect(`${process.env.CLIENT_URL}/finalRegister/1`)
        // } else {
        //     res.clearCookie('dataRegister');
        //     return res.redirect(`${process.env.CLIENT_URL}/finalRegister/0`)
        // }
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
                success: true,
                accessToken,
                userData
            })
        } else {
            throw new Error('Invalid credentials!')
        }
    })

    getCurrent = asyncHandler(async (req, res) => {
        const { _id } = req.user
        const user = await User.findById(_id).select('-refreshToken -password')
        return res.status(200).json({
            success: user ? true : false,
            rs: user ? user : 'Không tìm thấy người dùng'
        })
    })

    refreshAccessToken = asyncHandler(async (req, res) => {
        // Lấy token từ cookies
        const cookie = req.cookies;
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
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) throw new Error('Không tìm thấy refresh token trong cookies')
        await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
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
        const { email } = req.body

        if (!email) throw new Error('Thiếu email')
        const user = await User.findOne({ email })
        if (!user) throw new Error('Không tìm thấy email người dùng')
        const resetToken = user.createPasswordChangedToken()
        await user.save()

        const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

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
        if (!user) throw new Error('Phiên quên mật này đã hết hạn, Vui lòng gửi email.')
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
        const queries = { ...req.query };
        const excludeFields = ["limit", "sort", "page", "fields", "random", "seed"];
        excludeFields.forEach(el => delete queries[el]);
        const filter = {};
        for (const key in queries) {
            const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
            if (match) {
                const [_, field, op] = match;
                filter[field] = filter[field] || {};
                filter[field][`$${op}`] = Number(req.query[key]);
            } else if (key === "name") {
                filter.name = { $regex: queries[key], $options: "i" };
            } else {
                // Nếu giá trị có dấu phẩy → lọc theo nhiều giá trị
                if (typeof queries[key] === "string" && queries[key].includes(",")) {
                    filter[key] = { $in: queries[key].split(",") };
                } else {
                    filter[key] = queries[key];
                }
            }
        }

        try {
            const seedrandom = require("seedrandom");
            const isRandom = req.query.random === "true";
            const limit = Number(req.query.limit);
            const sort = req.query.sort || "-createdAt";
            const page = Number(req.query.page) || 1;
            const skip = (page - 1) * limit;
            const seed = req.query.seed || "default-seed";

            if (isRandom) {
                const filteredProducts = await User.find(filter).lean();
                const rng = seedrandom(seed);

                const shuffled = filteredProducts
                    .map(p => ({ p, sortKey: rng() }))
                    .sort((a, b) => a.sortKey - b.sortKey)
                    .map(el => el.p);

                const selected = shuffled.slice(0, limit);

                return res.status(200).json({
                    success: true,
                    productDatas: selected,
                    counts: selected.length,
                    totalPages: 1,
                    currentPage: 1,
                });
            } else {
                // Xử lý truy vấn bình thường (có phân trang, sắp xếp,...)
                const productQuery = User.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);

                const [products, total] = await Promise.all([
                    productQuery.lean(),
                    User.countDocuments(filter)
                ]);

                return res.status(200).json({
                    success: true,
                    userDatas: products,
                    counts: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                });
            }
        } catch (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
    })

    deleteUser = asyncHandler(async (req, res) => {
        const { _id } = req.query;

        if (!_id) throw new Error('Thiếu đầu vào');

        const checkOrder = await Order.findOne({ orderBy: _id });
        if (checkOrder) {
            return res.status(400).json({
                success: false,
                message: "Không thể xoá người dùng này vì có đơn hàng liên quan"
            });
        }

        const checkRating = await Product.findOne({ "ratings.postedBy": _id });

        if (checkRating) {
            return res.status(400).json({
                success: false,
                message: "Không thể xoá người dùng này vì đã có đánh giá sản phẩm liên quan"
            });
        }

        if (!_id) throw new Error('Missing inputs')
        const response = await User.findByIdAndDelete(_id)
        return res.status(200).json({
            success: response ? true : false,
            deletedUser: response ? `Người dùng với email ${response.email} đã xoá` : 'Không tìm thấy người dùng'
        })
    })

    updateUser = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        if (!_id || (Object.keys(req.body).length === 0 && !req.file)) {
            throw new Error('Thiếu đầu vào');
        }

        const updateData = { ...req.body };

        if (req.file) {
            // nếu dùng local
            updateData.image = req.file.path;

            // nếu dùng Cloudinary thì:
            // const result = await cloudinary.uploader.upload(req.file.path);
            // updateData.image = result.secure_url;
        } else {
            // không có file thì giữ nguyên ảnh cũ
            delete updateData.image;
        }

        const response = await User.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        ).select('-password -role -refreshToken');

        return res.status(200).json({
            success: !!response,
            updatedUser: response || 'Đã có lỗi xảy ra'
        });
    });


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
        const { product, color, size, quantity } = req.body;

        // productId là bắt buộc
        if (!product) {
            return res.status(400).json({
                success: false,
                mes: "Thiếu productId"
            });
        }

        // tạo điều kiện match
        const match = { product };
        if (color) match.color = color;
        if (size) match.size = size;

        // kiểm tra trong giỏ đã có chưa
        const check = await User.findOne({
            _id,
            cart: { $elemMatch: match }
        });

        if (check) {
            return res.status(400).json({
                success: false,
                mes: "Sản phẩm đã tồn tại trong giỏ"
            });
        }

        // chưa có thì thêm vào giỏ
        const user = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { ...req.body } } },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            mes: "Thêm sản phẩm vào giỏ thành công",
            cart: user.cart
        });
    });

    updateCartQuantity = asyncHandler(async (req, res) => {
        const { _id } = req.user; // id của user từ token
        const { cid } = req.params; // id của item trong giỏ
        const { quantity } = req.body; // số lượng mới

        if (!cid || typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({
                success: false,
                mes: "Thiếu cid hoặc quantity không hợp lệ"
            });
        }

        const user = await User.findOneAndUpdate(
            { _id, "cart._id": cid },
            { $set: { "cart.$.quantity": quantity } },
            { new: true } // trả về document đã update
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                mes: "Không tìm thấy sản phẩm trong giỏ"
            });
        }

        return res.status(200).json({
            success: true,
            mes: "Cập nhật số lượng thành công",
            cart: user.cart
        });
    });

    // chưa có thì

    removeCart = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { cid } = req.params;
        const user = await User.findByIdAndUpdate(
            _id,
            { $pull: { cart: { _id: cid } } },
            { new: true }
        ).select("cart");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            mes: "Đã xóa sản phẩm khỏi giỏ hàng thành công",
            cart: user.cart,
        });
    });

    updateAddress = asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { address } = req.body;

        if (!_id) {
            return res.status(401).json({
                success: false,
                message: "User chưa đăng nhập"
            });
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin địa chỉ"
            });
        }

        const response = await User.findByIdAndUpdate(
            _id,
            { address },
            { new: true }
        );

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật địa chỉ thành công",
            data: response.address
        });
    });


}

module.exports = new UserController;