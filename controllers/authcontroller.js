const { validationResult } = require('express-validator')
const User = require('../models/usersmodel')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authcontroller = {}

authcontroller.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }
        const passwordMatch = await bcryptjs.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }
        const tokendata = { _id: user._id, name: user.name, email: user.email, role: user.role }
        const token = jwt.sign(tokendata, process.env.JWT_KEY, { expiresIn: '8h' })

        res.status(200).json({ user, token, message: 'Login successful' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

authcontroller.signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        console.log("signup")
        const { name, email, phone, password } = req.body
        const existingUser = await User.findOne({ $or: [{ name }, { email }] })
        if (existingUser) {
            return res.status(400).json({ message: 'Name or email already exists' })
        }
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = new User({ name, email, phone, password: hashedPassword })
        await newUser.save()
        res.status(200).json({ newUser, message: 'User added successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}



module.exports = authcontroller;
