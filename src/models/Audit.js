const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        action: {
            type: String,
            required: true,
            enum: [
                'ADMIN_LOGIN',
                'ADMIN_LOGOUT',
                'USER_STATUS_UPDATE',
                'WALLET_BALANCE_ADJUST'
            ],
            index: true
        },
        targetedUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true
        },
        oldValue: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        newValue: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },
        ipAddress: {
            type: String,
            default: null
        },
        userAgent: {
            type: String,
            default: null
        },
        meta: {
            type: Object,
            default: {}
        },
    },
    {
        timestamps: true
    }
);

auditSchema.index({ adminId: 1, createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });
auditSchema.index({ targetedUserId: 1, createdAt: -1 });


auditSchema.pre(['updateOne', 'findOneAndUpdate', 'deleteOne'],
    function () {
        throw new Error("Audit logs are immutable");
    });

const AuditLog = mongoose.model('AuditLog', auditSchema);
module.exports = AuditLog;