
const isValid = (req, res, next) => {
    const { name, age } = req.body;

    if (!name || age === undefined) {
        console.log('middleware Invalid');
        return res.status(400).json({
            message: "Name and age are required",

        });

    }
    if (typeof age !== "number") {
        return res.status(400).json({
            message: "age must be a number"
        });
    }
    console.log('middleware valid');
    next();

};

module.exports = isValid;