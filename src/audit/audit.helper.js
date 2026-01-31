const AuditRepository = require('./audit.repository');
const auditRepository = new AuditRepository();


const createAuditLog = async ({
    adminId,
    action,
    targetedUserId = null,
    oldValue = null,
    newValue = null,
    ipAddress = null,
    userAgent = null,
    meta = {}
}) => {
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
        });
    } catch (err) {

        console.log('Audit Log failed:', err.message);
    }
}

module.exports = createAuditLog;
