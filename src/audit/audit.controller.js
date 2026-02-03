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
        console.log("error is:", err);
        next(err);
    }

}