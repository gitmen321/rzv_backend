const AuditServices = require('./audit.service');
const AuditRepository = require('./audit.repository');

const auditRepository = new AuditRepository();
const auditServices = new AuditServices(auditRepository);


exports.getAuditLogs = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await auditServices.findAuditLogs(query);
        res.status(200).json({
            message: 'AUDIT LOGS:',
            ...result,
        });

    } catch (err) {
        console.error("error is:", err);
        next(err);
    }

};


exports.getRecentActivites = async (req, res, next) => {
    try {
        const adminId = req.user.id;

        const activities = await auditServices.getRecentActivities(adminId);

        return res.status(200).json({
            message: "RECENT_ACTIVITY",
            data: activities
        });

    } catch (err) {
        next(err);
    }
}