const AuditRepository = require('./audit.repository');
const auditRepository = new AuditRepository();

const structuredLogger = require('../utils/structured-logger');


const createAuditLog = async ({
    adminId,
    action,
    targetedUserId = null,
    oldValue = null,
    newValue = null,
    ipAddress = null,
    userAgent = null,
    meta = {}
}, session = null) => {
    try {

        await auditRepository.create({
            adminId,
            action,
            targetedUserId,
            oldValue,
            newValue,
            ipAddress,
            userAgent,
            meta
        }, session );
    } catch (err) {
        structuredLogger.error('Audit Log failed:', err.message);
        throw err;
    }
}

module.exports = createAuditLog;
