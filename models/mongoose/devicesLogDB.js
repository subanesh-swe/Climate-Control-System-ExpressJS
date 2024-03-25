const mongoose = require('mongoose');

const cardsSchema = mongoose.Schema({
    cardTitle: {
        type: String,
        required: true
    },
    card: {
        type: Object,
        default: {}
    }
});

const devicesLogDBSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    cards: {
        type: [cardsSchema], // Embed the cardsSchema
        default: []
    },
    createdAt: {
        type: Date, // Define createdAt as a Date field
        default: Date.now
    },
    updatedAt: {
        type: Date, // Define updatedAt as a Date field
        default: Date.now
    }
}, { timestamps: true });

module.exports = new mongoose.model('devicesLogDB', devicesLogDBSchema);

