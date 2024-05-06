const recordcontroller = {};
const Notification = require('../models/notificationmodel');

const AWS = require('aws-sdk');
const route53 = new AWS.Route53({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

recordcontroller.getAllRecords = async (req, res) => {
    // console.log("getAllRecords")
    // console.log(req.params)
    try {
        const { id } = req.params;
        const params = {
            HostedZoneId: id
        };
        const recordSet = await route53.listResourceRecordSets(params).promise();
        res.json(recordSet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

recordcontroller.createRecord = async (req, res) => {
    console.log("createRecord")
    try {
        const { HostedZoneId, name, type, value } = req.body
        const params = {
            HostedZoneId: HostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'CREATE',
                        ResourceRecordSet: {
                            Name: name,
                            Type: type,
                            TTL: 300,
                            ResourceRecords: value.map(v => ({
                                Value: v
                            }))
                        }
                    }
                ]
            }
        };
        const changeResponse = await route53.changeResourceRecordSets(params).promise();
        const notification = new Notification({
            message: `Record Created - ${name} - ${type} by ${req.user.name}`,
        })
        await notification.save()
        res.status(201).json({ Status: "SUCCESS", changeResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

recordcontroller.deleteRecord = async (req, res) => {
    console.log("deleteRecord");
    console.log(req.body)
    try {
        const { HostedZoneId, name, type, value } = req.body;
        const params = {
            HostedZoneId: HostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'DELETE',
                        ResourceRecordSet: {
                            Name: name,
                            Type: type,
                            TTL: 300,
                            ResourceRecords: value.map(v => ({
                                Value: v
                            }))
                        }
                    }
                ]
            }
        };
        const changeResponse = await route53.changeResourceRecordSets(params).promise();
        const notification = new Notification({
            message: `Record Deleted - ${name} - ${type} by ${req.user.name}`,
        })
        await notification.save()
        res.status(201).json({ Status: "SUCCESS", changeResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}


recordcontroller.editRecord = async (req, res) => {
    console.log("editRecord");
    try {
        const { HostedZoneId, name, type, value } = req.body;
        const params = {
            HostedZoneId: HostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: {
                            Name: name,
                            Type: type,
                            TTL: 300,
                            ResourceRecords: value.map(v => ({
                                Value: v
                            }))
                        }
                    }
                ]
            }
        };
        const existingParams = {
            HostedZoneId: HostedZoneId,
            StartRecordName: name,
            StartRecordType: type,
            MaxItems: '1'
        };
        const existingRecords = await route53.listResourceRecordSets(existingParams).promise();

        if (existingRecords.ResourceRecordSets.length > 0) {
            params.ChangeBatch.Changes[0].Action = 'UPSERT';
        } else {
            params.ChangeBatch.Changes[0].Action = 'CREATE';
        }

        const changeResponse = await route53.changeResourceRecordSets(params).promise();
        const notification = new Notification({
            message: `Record Updated - ${name} - ${type} by ${req.user.name}`,
        });
        await notification.save();
        res.status(201).json({ Status: "SUCCESS", changeResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}




module.exports = recordcontroller