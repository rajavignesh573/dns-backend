const jwt = require("jsonwebtoken")
const authenticateUser = (req, res, next) => {
    console.log("authenticateUser")
    const token = req.headers['authorization']
    if (!token) {
        return res.status(400).json({ error: "JWT token missing" })
    }
    try {
        const tokendata = jwt.verify(token, process.env.JWT_KEY)
        if (tokendata) {
            req.user = {
                email: tokendata.email,
                role: tokendata.role,
                _id: tokendata._id,
                name: tokendata.name
            }
        }
        next()
    } catch (error) {
        console.log("authenticateUser-error")
        console.log(error)
        return res.status(401).json({ errors: error })
    }
}
module.exports = authenticateUser
