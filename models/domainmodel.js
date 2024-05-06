const mongoose = require('mongoose');

const domainSchema = new mongoose.Schema({
    Id: {
        type: String,
        required: true,
        unique: true
    },
    Name: {
        type: String,
        required: true,
    },
    CallerReference: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Domain = mongoose.model('Domain', domainSchema);
module.exports = Domain;
