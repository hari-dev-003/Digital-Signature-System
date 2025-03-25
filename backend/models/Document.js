const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentName: { type: String, required: true },
    documentData: { type: Buffer, required: true }, // Store document as Buffer
    signature: { type: String }, // User's typed signature
    verificationKey: { type: String }, // Key for verification
    isSigned: { type: Boolean, default: false }, // Flag to indicate if the document is signed
    verificationStatus: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', DocumentSchema);
