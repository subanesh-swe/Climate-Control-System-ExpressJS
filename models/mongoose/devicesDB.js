const mongoose = require('mongoose');

const participantSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

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

const devicesDBSchema = mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    participants: {
        type: [participantSchema],
        default: []
    },
    cards: {
        type: [cardsSchema], // Embed the cardsSchema
        default: []
    },
    updateInterval: {
        type: Number, // Define updatedAt as a Date field
        default: 20
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

module.exports = new mongoose.model('devicesDB', devicesDBSchema);



// // Example data
//data = {
//    "deviceId": "lki8nxfxpfd6ma3cjpl",
//    "deviceName": "admin's device",
//    "password": "$2b$10$Y/N7W6poXCj1C8WWZSUE4.Hyzi1HffQ9pWbaYtA3rsmhJP1wskYpy",
//    "participants": [
//        {
//            "username": "subanesh",
//            "userId": "d478fb4f-49a8-5acf-f9fb-e2a610f347b9",
//            "admin": true,
//        }
//    ],
//    "cards": [
//        {
//            "cardTitle": "OCT-1",
//            "card": {
//                "CO2Value": "123",
//                "TempValue": "23",
//                "OzoneStatus": "OFF",
//                "OzoneSwitch": "1",
//                "CO2ValueLimit": "234"
//            },
//        },
//        {
//            "cardTitle": "OCT-2",
//            "card": {
//                "CO2Value": "123",
//                "TempValue": "23",
//                "OzoneStatus": "OFF",
//                "OzoneSwitch": "1",
//                "CO2ValueLimit": "234"
//            },
//        },
//        {
//            "cardTitle": "OCT-3",
//            "card": {
//                "CO2Value": "123",
//                "TempValue": "23",
//                "OzoneStatus": "OFF",
//                "OzoneSwitch": "1",
//                "CO2ValueLimit": "234"
//            },
//        }
//    ],
//    "createdAt": {
//        "$date": "2024-03-24T14:49:01.385Z"
//    },
//    "updatedAt": {
//        "$date": "2024-03-24T14:49:01.385Z"
//    },
//}


//// add Device to MongoDB
//function addDevicetoMongoose() {

//    // Create a new device instance
//    const newDevice = new devicesDB({
//        deviceId: "lki8nxfxpfd6ma3cjpl",
//        deviceName: "admin's device",
//        password: "$2b$10$Y/N7W6poXCj1C8WWZSUE4.Hyzi1HffQ9pWbaYtA3rsmhJP1wskYpy",
//        participants: [
//            {
//                username: "subanesh",
//                userId: "d478fb4f-49a8-5acf-f9fb-e2a610f347b9",
//                admin: true,
//            }
//        ],
//        cards: [
//            {
//                cardTitle: "OCT-1",
//                card: {
//                    CO2Value: "123",
//                    TempValue: "23",
//                    OzoneStatus: "OFF",
//                    OzoneSwitch: "1",
//                    CO2ValueLimit: "234"
//                },
//            }, {
//                cardTitle: "OCT-2",
//                card: {
//                    CO2Value: "123",
//                    TempValue: "23",
//                    OzoneStatus: "OFF",
//                    OzoneSwitch: "1",
//                    CO2ValueLimit: "234"
//                },
//            }, {
//                cardTitle: "OCT-3",
//                card: {
//                    CO2Value: "123",
//                    TempValue: "23",
//                    OzoneStatus: "OFF",
//                    OzoneSwitch: "1",
//                    CO2ValueLimit: "234"
//                },
//            },
//        ],
//    });

//    // Save the new device instance
//    newDevice.save()
//        .then(savedDevice => {
//            console.log('Device saved successfully:', savedDevice);
//        })
//        .catch(error => {
//            console.error('Error saving device:', error);
//        });
//}

//console.log('Trying to add new device.');
//addDevicetoMongoose();