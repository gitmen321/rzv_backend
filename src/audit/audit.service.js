
class AuditServices {
    constructor(auditRepository) {
        this.auditRepository = auditRepository
    }

    async findAuditLogs(query) {
        const { page = 1, limit = 20, action, adminId, targetedUserId } = query;

        const filters = {};
        if (action) filters.action = action;
        if (adminId) filters.adminId = adminId;
        if (targetedUserId) filters.targetedUserId = targetedUserId;

        console.log('queries:', page, limit, filters);

        return this.auditRepository.findAll({
            filters,
            page: Number(page),
            limit: Number(limit),
        });
    }
    
}

module.exports = AuditServices;