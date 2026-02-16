
const isLoginvalid = async (req, res, next) => {

    if (req.body === undefined) {
        res.status(400).json({
            message: 'EMAIL AND PASSWORD REQUIRED'
        });
    }
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(401).json({
            message: 'INVALID_CREDENTIALS'
        });
    }
    next();
}

module.exports = isLoginvalid;