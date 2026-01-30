import auditRepository from "./audit.repository";

exports.createAuditLog = async ({
    adminId,
    action,
    targetedUserId = null,
    oldValue = null,
    newValue = null,
    req = null,
    meta = {}
}) => {
    try {

        await auditRepository.create({
            adminId,
            action,
            targetedUserId,
            oldValue,
            newValue,
            ipAddress: req?.ip || null,
            meta
        });
    } catch (err) {

        console.log('Audit Log failed:', err.message);
    }
}
