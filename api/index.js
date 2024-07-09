const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User.js");
const cookieParser = require("cookie-parser");
const imageDowonloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Place = require("./models/Place.js");
const Booking = require("./models/UserBooking.js");
require("dotenv").config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const app = express();

app.use(cookieParser());
// EGk1UASoAEYg12RF

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "dakeiraihfdskn4rio45243j";

app.use(express.json());

app.use("/uploads", express.static(__dirname + "\\uploads"));

app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5174",
    })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
    res.json("test ok");
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already registered!" });
        }
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });

        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email: email });

    if (userDoc) {
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            jwt.sign(
                { email: userDoc.email, id: userDoc._id },
                jwtSecret,
                {},
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.cookie("token", token).json(userDoc);
                }
            );
        } else {
            res.status(422).json("pass not ok");
        }
    } else {
        res.status(404).json("not found");
    }
});

app.get("/profile", (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) {
                throw err;
            }
            const { name, email, _id } = await User.findById(user.id);
            res.json({ name, email, _id });
        });
    } else {
        res.json(null);
    }
});

app.post("/logout", (req, res) => {
    res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
    const { link } = req.body;

    const newName = "photo" + Date.now() + ".jpg";
    const dirName = __dirname + "\\uploads";
    await imageDowonloader.image({
        url: link,
        dest: dirName + "\\" + newName,
    });
    res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, originalname } = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace("uploads\\", ""));
    }
    res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
    const { token } = req.cookies;
    const {
        address,
        title,
        // photos: addedPhotos,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        perNightCharge,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userDoc) => {
        if (err) {
            throw err;
        }

        const placeDoc = await Place.create({
            owner: userDoc.id,
            address,
            title,
            // photos: addedPhotos,
            photos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            perNightCharge,
        });
        res.json(placeDoc);
    });
});

app.get("/user-places", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userDoc) => {
        if (err) {
            throw err;
        }

        const { id } = userDoc;
        res.json(await Place.find({ owner: id }));
    });
});

app.get("/places/:id", async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
});

app.put("/places/", async (req, res) => {
    const { token } = req.cookies;
    const {
        id,
        address,
        title,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        perNightCharge,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userDoc) => {
        if (err) {
            throw err;
        }
        const placeDoc = await Place.findById(id);

        if (userDoc.id === placeDoc.owner.toString()) {
            placeDoc.set({
                address,
                title,
                photos: addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
                perNightCharge,
            });
            await placeDoc.save();
            res.json("ok");
        }
    });
});

app.get("/home-places", async (req, res) => {
    res.json(await Place.find());
});

app.post("/user-booking", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (error, userDoc) => {
        if (error) throw error;
        const {
            placeId,
            checkIn,
            checkOut,
            guest,
            name,
            bookingAmount,
            phone,
        } = req.body;
        Booking.create({
            placeId,
            user: userDoc.id,
            checkIn,
            checkOut,
            // guest,
            name,
            bookingAmount,
            phone,
        })
            .then((docBooking) => {
                res.json(docBooking);
            })
            .catch((error) => {
                throw error;
            });
    });
});

app.get("/user-booking", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (error, userDoc) => {
        if (error) throw error;
        // console.log(userDoc)
        const { id } = userDoc;
        res.json(await Booking.find({ user: userDoc.id }).populate("placeId"));
    });
});

app.post("/order", async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = req.body;
        const order = await razorpay.orders.create(options);
        if (!order) {
            return res.status(400).send("bad Request");
        }

        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.post("/validate", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
        return res.status(400).send("bad request");
    }

    res.json({
        msg: "Transaction legit",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
    });
});

app.get("/checkdate/", async (req, res) => {
    // console.log(await Booking.findOne({placeId: id}))
    res.json(await Booking.find({ placeId: req.query.id }).populate("_id"));
    // res.send('ok')
    // console.log(data);
});

app.listen(5000);
