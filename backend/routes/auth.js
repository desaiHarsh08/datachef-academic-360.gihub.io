import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fetchuser from '../middleware/fetchuser.js'

const JWT_SECRET = process.env.JWT_SECRET;
const DATACHEF_NAME = process.env.NAME1;
const HARSH_NAME = process.env.NAME2;
const DATACHEF_EMAIL = process.env.DATACHEF_EMAIL;
const DATACHEF_PASSWORD = process.env.DATACHEF_PASSWORD;
const HARSH_EMAIL = process.env.HARSH_EMAIL;
const HARSH_PASSWORD = process.env.HARSH_PASSWORD;

const defaultProfileArr = [
    {
        email: DATACHEF_EMAIL,
        password: DATACHEF_PASSWORD,
        name: DATACHEF_NAME
    },
    {
        email: HARSH_EMAIL,
        password: HARSH_PASSWORD,
        name: HARSH_NAME
    }
]

for(let i = 0; i< defaultProfileArr.length; i++) {
    // Default admin
    (async () => {

            let user = await User.findOne({ email: defaultProfileArr[i].email });
            if (!user) {
                const salt = await bcrypt.genSalt(10);
                let secPass = await bcrypt.hash(defaultProfileArr[i].password, salt);
    
                // Add Admin
                user = await User.create({
                    name: defaultProfileArr[i].name,
                    email: defaultProfileArr[i].email,
                    password: secPass
                });
            }

        })();
    }





const router = express.Router();

// ROUTE 1: Create a user using POST "/api/auth/create". No login requires
router.post('/create', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be of atleast 5 characters!').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check whether the user wih this email exist already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist!" })
        }
        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken })
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }

})


// ROUTE 2: Authenticate a user using POST "/api/auth/login". No login requires
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank!').exists()
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Please try to login with correct credentials" });
        }


        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(401).json({ error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken, name: user.name })
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }

})


// ROUTE 3: Get loggedin user using POST "/api/auth/login". Login required
router.get('/getuser', fetchuser, async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }

})


// ROUTE 4: Change user password using POST "/api/auth/update". Login required
router.get('/update', fetchuser, [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank!').exists()
], fetchuser, async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        const salt = await bcrypt.genSalt(10);
        let secPass = await bcrypt.hash(password, salt);
        user.password = secPass;
        let updatedUser = await user.save();
        res.status(200).json({ message: "Success!", updatedUser });
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }

})



// ROUTE 5: Authenticate a user using Google POST "/api/auth/login". access-token required
router.post('/google-login', [
    body('email', 'Enter a valid email').isEmail()
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    console.log(email)

    try {
        let user = await User.findOne({ email });
        console.log(user)
        if (user === null) {
            console.log('in null')
            return res.status(401).json({ error: "Please try to login with correct credentials" });
        }
        else {
            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken })
        }


    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }

})



export default router;