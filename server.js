require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { checkSchema } = require('express-validator')

const port = process.env.PORT || 4000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const connect_db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}
connect_db()

const authcontroller = require('./controllers/authcontroller')
const { userSignupSchema, userLoginSchema } = require('./validators/usersValidator')
const dnscontroller = require('./controllers/dnscontroller')
const recordcontroller = require('./controllers/recordcontroller')
const authenticateUser = require('./middlewares/authenticate')
const notificationcontroller = require('./controllers/notificationcontroller')

app.get('/', (req, res) => { res.send("Welcome, Hello world!") })

app.post('/api/login', checkSchema(userLoginSchema), authcontroller.login)
app.post('/api/signup', checkSchema(userSignupSchema), authcontroller.signup)

app.get('/api/hostedzones', authenticateUser, dnscontroller.getAllHostedZones);
app.post('/api/hostedzones', authenticateUser, dnscontroller.createHostedZone);
app.delete('/api/hostedzones/:domainId', authenticateUser, dnscontroller.deleteHostedZone);

app.get('/api/records/:id', authenticateUser, recordcontroller.getAllRecords);
app.post('/api/records', authenticateUser, recordcontroller.createRecord);
app.delete('/api/records', authenticateUser, recordcontroller.deleteRecord);
app.put('/api/records', authenticateUser, recordcontroller.editRecord);

app.get('/api/notifications', notificationcontroller.getNotifications);

app.listen(process.env.PORT, () => {
    console.log(`port running on ${port}`)
})