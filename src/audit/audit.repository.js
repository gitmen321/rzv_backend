const AuditLog = require('../models/Audit');

class AuditRepository {

    async create(data) {
        return AuditLog.create(data);
    }

    async findAll({
        page = 1,
        limit = 20,
        filters = {}
    }) {
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            AuditLog.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('adminId', 'email role')
                .populate('targetedUserId', 'email role')
                .lean(),

            AuditLog.countDocuments(filters)
        ]);

        return {
            data: logs,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findRecentByAdmin(adminId, limit = 10) {
        return AuditLog.find({ adminId })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
    }
}

module.exports = AuditRepository;