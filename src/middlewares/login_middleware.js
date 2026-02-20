
const isLoginvalid = async (req, res, next) => {

    if (req.body === undefined) {
        throw new Error("EMAIL AND PASSWORD REQUIRED");
        
    }
    const { email, password } = req.body;
    if (!email || !password) {
        throw new Error("INVALID_CREDENTIALS");
        
    }
    next();
}

module.exports = isLoginvalid;