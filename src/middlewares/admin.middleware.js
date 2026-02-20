const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("invalid id");
        return res.status(400).json({
            success: false,
            message: "Invalid User Id format"
        });

    }
    next();
}

const validStatusUpdate = (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "isActive field required"
        });
    }
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: "isActive must be TRUE OR FALSE"
        });
    }
    next();
}

const validAdjustBalance = (req, res, next) => {

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: "amount, type, reason required"
        });
    }

    const { amount, type, reason } = req.body;

    if (type !== 'DEBIT' && type !== 'CREDIT') {
        return res.status(400).json({
            success: false,
            message: "type should be CREDIT OR DEBIT"
        });
    }
    if (!amount > 0) {
        return res.status(400).json({
            success: false,
            message: "AMOUNT_SHOULDBE_GREATER_THAN_ZERO"
        });
    }
    if (!reason) {
        return res.status(400).json({
            success: false,
            message: "REASON_REQUIRED"
        });
    }
    next();
}

const validWalletSummaryByDate = (req, res, next) => {
    const queryDate = req.query.date;

    if (!queryDate) {
        return res.status(400).json({
            success: false,
            message: "SINGLE_DATE_REQUIRED EG: date = year-month-date"
        });
    }
    if (isNaN(queryDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "INVALID_DATE_FORMAT_PROVIDED"
        });
    }
    next();
}

const valdateRange = (req, res, next) => {
    if (!req.query) {
        return res.status(400).json({
            success: false,
            message: "START AND END DATE REQUIRED"
        });
    }
    const { start, end } = req.query;

    if (!start || !end) {
        return res.status(400).json({
            success: false,
            message: "START AND END DATE REQUIRED"
        });
    }
    const startDate = new Date(start);
    const endDate = new Date(end);


    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: "INVALID_DATE_FORMAT_PROVIDED"
        });
    }

    if (start >= end) {
        return res.status(400).json({
            success: false,
            message: "START DATE SHOULD BE LESSTHAN END DATE"
        });
    }

    next();
}

module.exports = { validateObjectId, validWalletSummaryByDate, validStatusUpdate, validAdjustBalance, valdateRange };