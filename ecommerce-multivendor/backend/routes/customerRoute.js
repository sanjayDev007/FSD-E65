const router = require('express').Router();
var admin = require("firebase-admin");
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

router.post('/login',async (req, res) => {
        try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;
        console.log(decodedToken);
        // await Customer.findOneAndUpdate(
        //     { email: decodedToken.email },
        //     { email: decodedToken.email, firstName: decodedToken.name || 'GoogleUser' },
        //     { upsert: true, new: true }
        // );

        // const token = jwt.sign({ uid, email: decodedToken.email }, JWT_SECRET, { expiresIn: '365d' });
        // res.status(200).json({ message: 'Login successful', uid, email: decodedToken.email, token });
        res.send("ok");
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

router.post('/register', async (req, res) => {
           try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;
        console.log(decodedToken);

        // create or update the customer using the email from the decoded token
        await Customer.findOneAndUpdate(
            { email: decodedToken.email },
            { 
            email: decodedToken.email,
            firstName: decodedToken.name || 'GoogleUser',
            firebaseUid: uid
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.send("ok");
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
})

router.post('/google-login', async (req, res) => {
    try {
        const access_token = req.body.access_token;
        const decodedToken = await admin.auth().verifyIdToken(access_token);
        const uid = decodedToken.uid;

        await Customer.findOneAndUpdate(
            { email: decodedToken.email },
            { email: decodedToken.email, firstName: decodedToken.name || 'GoogleUser' },
            { upsert: true, new: true }
        );

        const token = jwt.sign({ uid, email: decodedToken.email }, JWT_SECRET, { expiresIn: '365d' });
        res.status(200).json({ message: 'Login successful', uid, email: decodedToken.email, token });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;