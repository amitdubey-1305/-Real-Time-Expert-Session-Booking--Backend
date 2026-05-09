const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key_12345", {
        expiresIn: "30d",
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            phone,
            password
        });

        if (user) {
            res.status(201).json({
                success: true,
                token: generateToken(user._id),
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                token: generateToken(user._id),
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error in getMe:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
