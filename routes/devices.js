const express = require('express');
const router = express.Router();

const path = require('path');
const devicesDB = require(path.join(__dirname, '..', 'models', 'mongoose', 'devicesDB.js'));
const devicesLogDB = require(path.join(__dirname, '..', 'models', 'mongoose', 'devicesLogDB.js'));

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(`@/devices [get] : req.body : ${JSON.stringify(req.body)}`);
    res.render('index', { title: 'Climate Control System' });
});


router.post('/', async (req, res, next) => {
    try {
        console.log(`@/devices [post] : req.body : ${JSON.stringify(req.body)}`);
        //console.log(`@/devices [post] : req.body : ${JSON.stringify(req.body, null, 2)}`);
        var { updateValueList, disableRateLimit, saveDataLog, data } = req.body;

        if (updateValueList == null || disableRateLimit == null || saveDataLog == null || data == null) {
            // throw new Error("Input field invalid !!! either due to invalid access to server or communication error");
            return res.json({ result: false, alert: "Input field invalid !!! either due to invalid access to server or communication error, try again after sometime or try contacting the admin!!!" });
        }

        let currDeviceId = data?.["deviceId"];
        let predata = await devicesDB.findOne({ deviceId: currDeviceId });
        //console.log(`@/devices [post] : [fetch deviceDB] mongodb data : ${JSON.stringify(predata, null, 2)}`);
        if (predata != null && predata.length != 0) {

            // Get the current time in milliseconds
            const currentTime = new Date().getTime();
            // Get the updatedAt time of the device in milliseconds
            const updatedAtTime = predata.updatedAt.getTime();
            // Calculate the difference in seconds
            const differenceInSeconds = Math.floor((currentTime - updatedAtTime) / 1000);

            if (!disableRateLimit && differenceInSeconds < predata.updateInterval) {
                return res.json({ result: false, alert: "Rate Limit Exceeded!!!" });
            }

            else {
                let isValueChanges = false;

                for (let i = 0; i < updateValueList.length; i++) {
                    let currUp = updateValueList[i];

                    if (currUp.length == 0) {
                        continue;
                    } else if (currUp.length == 1
                        && predata[currUp[0]] !== data[currUp[0]]) {
                        predata[currUp[0]] = data[currUp[0]];
                        isValueChanges = true;
                    } else if (currUp.length == 2
                        && predata[currUp[0]][currUp[1]] !== data[currUp[0]][currUp[1]]) {
                        predata[currUp[0]][currUp[1]] = data[currUp[0]][currUp[1]];
                        isValueChanges = true;
                    } else if (currUp.length == 3
                        && predata[currUp[0]][currUp[1]][currUp[2]] !== data[currUp[0]][currUp[1]][currUp[2]]) {
                        predata[currUp[0]][currUp[1]][currUp[2]] = data[currUp[0]][currUp[1]][currUp[2]];
                        isValueChanges = true;
                    } else if (currUp.length == 4
                        && predata[currUp[0]][currUp[1]][currUp[2]][currUp[3]] !== data[currUp[0]][currUp[1]][currUp[2]][currUp[3]]) {
                        predata[currUp[0]][currUp[1]][currUp[2]][currUp[3]] = data[currUp[0]][currUp[1]][currUp[2]][currUp[3]];
                        isValueChanges = true;
                    }
                }

                if (isValueChanges) {
                    console.log("saving predata");
                    // not necessary to update updatedAT, its updated automatically
                    //predata["updatedAt"] = new Date();
                    // Mark the 'cards' field as modified, so that it saves properly
                    predata.markModified('cards');
                    await predata.save();
                }

                // Remove fields from the document
                const currData = predata.toObject();
                delete currData._id;
                delete currData.__v;
                delete currData["participants"];
                delete currData["password"];
                delete currData["updateInterval"];
                if (isValueChanges && saveDataLog) {
                    console.log("saving predataLog");
                    const predataLog = new devicesLogDB(currData);
                    await predataLog.save();
                }

                console.log(`Response: ${JSON.stringify({ result: true, alert: "Successful!", data: currData }, null, 2)}`);
                return res.json({ result: true, alert: "Successful!", data: currData });

                //const devicePassword = predata.password;
                //bcrypt.compare(currPassword, devicePassword, async (err, result) => {
                //    if (err) {
                //        console.error(err);
                //        return res.json({ result: false, alert: "Something went wrong. ensure you have entered a valid input, please try again after sometime or try contacting the admin!!!" });
                //    } else if (result) {
                //        console.log(result);
                //    }
                //});
            }
                    
        } else {
            return res.json({ result: false, alert: "Invalid Device Id, there is no such device exist!!!" });
        }

        //return res.json({ result: false, alert: "if- else end -->>> Input field invalid !!! either due to invalid access to server or communication error, try again after sometime or try contacting the admin!!!" });

    } catch (error) {
        console.log(`Error @/devices [post] : ${error}`);
        return res.json({ result: false, alert: "Something went wrong, try again after sometime or try contacting the admin!!!" });
    }
});


// add Device to MongoDB
function addDevicetoMongoose() {

    // Create a new device instance
    //const newDevice = new devicesLogDB({
    const newDevice = new devicesDB({
        deviceId: "lki8nxfxpfd6ma3cjpl",
        deviceName: "admin's device",
        password: "$2b$10$Y/N7W6poXCj1C8WWZSUE4.Hyzi1HffQ9pWbaYtA3rsmhJP1wskYpy",
        participants: [
            {
                username: "subanesh",
                userId: "d478fb4f-49a8-5acf-f9fb-e2a610f347b9",
                admin: true,
            }
        ],
        cards: [
            {
                cardTitle: "OCT-1",
                card: {
                    CO2Value: "123",
                    TempValue: "23",
                    OzoneStatus: "OFF",
                    OzoneSwitch: "1",
                    CO2ValueLimit: "234"
                },
            },{
                cardTitle: "OCT-2",
                card: {
                    CO2Value: "123",
                    TempValue: "23",
                    OzoneStatus: "OFF",
                    OzoneSwitch: "1",
                    CO2ValueLimit: "234"
                },
            },{
                cardTitle: "OCT-3",
                card: {
                    CO2Value: "123",
                    TempValue: "23",
                    OzoneStatus: "OFF",
                    OzoneSwitch: "1",
                    CO2ValueLimit: "234"
                },
            },
        ],
    });

    // Save the new device instance
    newDevice.save()
        .then(savedDevice => {
            console.log('Device saved successfully:', savedDevice);
        })
        .catch(error => {
            console.error('Error saving device:', error);
        });
}

//console.log('Trying to add new device.');
//addDevicetoMongoose();

module.exports = router;
