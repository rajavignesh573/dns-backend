const dnscontroller = {};

const AWS = require('aws-sdk');
const Domain = require('../models/domainmodel');
const Notification = require('../models/notificationmodel');
// AWS Configuration
const route53 = new AWS.Route53({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

dnscontroller.getAllHostedZones = async (req, res) => {
    console.log("getAllHostedZones")
    try {
        const hostedZonesResponse = await route53.listHostedZones().promise();
        const formattedResponse = hostedZonesResponse.HostedZones.map(zone => ({
            Id: zone.Id.split('/hostedzone/')[1],
            Name: zone.Name,
            CallerReference: zone.CallerReference
        }));
        console.log(formattedResponse)
        res.json(formattedResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

dnscontroller.createHostedZone = async (req, res) => {
    console.log("createHostedZone")
    try {
        const params = {
            Name: req.body.name,
            CallerReference: String(Date.now()),
        };
        const createdHostedZone = await route53.createHostedZone(params).promise()
        console.log("createdHostedZone", createdHostedZone)
        const domain = new Domain({
            Id: createdHostedZone.HostedZone.Id.split('/').pop(),
            Name: createdHostedZone.HostedZone.Name,
            CallerReference: createdHostedZone.HostedZone.CallerReference
        })
        await domain.save()

        const notification = new Notification({
            message: `Domain Created - ${domain.Name} by ${req.user.name}`,
        })
        await notification.save()
        res.status(201).json(domain)

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

dnscontroller.deleteHostedZone = async (req, res) => {
    // console.log("deleteHostedZone")
    // console.log(req.params)
    try {
        const params = {
            Id: req.params.domainId
        };
        const deletedHostedZone = await route53.deleteHostedZone(params).promise();
        const notification = new Notification({
            message: `Domain Deleted - ${domain.Name} by ${req.user.name}`,
        })
        await notification.save()
        res.json({ Id: req.params.domainId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = dnscontroller;