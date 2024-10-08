const express = require("express")
const router = new express.Router()
const multer  = require('multer')



const MensRanking = require("../models/test")


const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Swagger documentation for login route
/**
 * @swagger
 * /mans/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login with tokens
 *       403:
 *         description: Invalid credentials
 */
router.post("/login", async (req, res) => {
    const { name } = req.body;
    console.log(name)
    const result = await MensRanking.find({ name: name });
    if (result.length == 0) {
        res.status(403).send("invalid")
    } else {
        let out = result[0].toJSON()
        delete out._id
        console.log(out)
        const token = jwt.sign(out, process.env.SECRET_KEY || "your_secret_key", { expiresIn: '1h' });
        const refreshToken = jwt.sign({name : out.name}, process.env.SECRET_KEY || "your_secret_key", { expiresIn: '7d' });

        res.json({ token, refreshToken });
    }
});

router.post("/token", (req, res) => {
    const { token } = req.body;
    if (!token || !refreshTokens.includes(token)) {
        return res.sendStatus(403); 
    }

    jwt.verify(token, process.env.SECRET_KEY || "your_secret_key", (err, user) => {
        if (err) return res.sendStatus(403); 

        const newAccessToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY || "your_secret_key", { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    });
});

router.use(authenticateToken);

/**
 * @swagger
 * /mans:
 *   post:
 *     summary: Create a new MensRanking entry
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *               score:
 *                 type: number
 *               event:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               
 *     responses:
 *       200:
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request
 */


router.post("/",upload.single('avatar'), async (req, res) => {
    console.log(req.file)
    try {
        const ress = new MensRanking({
            ...req.body, 
            avatar: req.file.path 
        });
        const result = await ress.save();
        res.status(200).send(result);
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * @swagger
 * /mans:
 *   get:
 *     summary: Retrieve all MensRanking entries
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of MensRanking entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                   country:
 *                     type: string
 *                   score:
 *                     type: number
 *                   event:
 *                     type: string
 *                   photo:
 *                     type: string
 *                     format: binary
 *       400:
 *         description: Bad request
 */
router.get("/", async (req, res) => {
    try {
        const getdata = await MensRanking.find({});
        res.send(getdata);
    } catch (e) {
        res.status(400).send(e)
    }
})

/**
 * @swagger
 * /mans/id/{id}:
 *   get:
 *     summary: Retrieve a MensRanking entry by ID
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the MensRanking entry
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved MensRanking entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 country:
 *                   type: string
 *                 score:
 *                   type: number
 *                 event:
 *                   type: string
 *                 photo:
 *                   type: string
 *                   format: binary
 *       400:
 *         description: Invalid ID supplied
 */
router.get("/id/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const getdataById = await MensRanking.findById(_id);
        res.send(getdataById);
    } catch (e) {
        res.status(400).send(e);
    }
});

/**
 * @swagger
 * /mans/id/{id}:
 *   patch:
 *     summary: Update a MensRanking entry by ID
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the MensRanking entry
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               country:
 *                 type: string
 *               score:
 *                 type: number
 *               event:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated MensRanking entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 dob:
 *                   type: string
 *                   format: date
 *                 country:
 *                   type: string
 *                 score:
 *                   type: number
 *                 event:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: MensRanking entry not found
 */
router.patch("/id/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const updatedataById = await MensRanking.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        res.send(updatedataById);
    } catch (e) {
        res.status(500).send(e);
    }
});

/**
 * @swagger
 * /mans/filter:
 *   get:
 *     summary: Retrieve MensRanking entries filtered by name
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered MensRanking entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                   country:
 *                     type: string
 *                   score:
 *                     type: number
 *                   event:
 *                     type: string
 *                   photo:
 *                     type: string
 *                     format: binary
 *       500:
 *         description: Internal server error
 */
router.get("/filter", async (req, res) => {
    try {
        const result = await MensRanking.find({ name: /hil/i }).exec();
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log('jjj');
        res.status(500).send(e);
    }
});

router.post("/photo", async (req, res) => {
    try {
        const photo = new MensRanking(req.body);
        const result = await photo.save()
        res.status(200).send(result)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router;