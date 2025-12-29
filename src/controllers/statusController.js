exports.getStatus = (req, res) =>{
    res.json({
        status: "Active",
        time: new Date()
    });
};