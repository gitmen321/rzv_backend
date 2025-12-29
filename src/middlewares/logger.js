function logger(req, res, next){
    console.log(`Route Hit-> ${req.method} ${req.url}`);
    next();
}

module.exports = logger;