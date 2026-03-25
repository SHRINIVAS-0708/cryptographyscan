const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const QRCode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let database = {}; // temporary storage

// Login API
app.post("/login", (req, res) => {
    const { platform, id, password } = req.body;

    const credentials = {
        amazon: { id: "123", password: "123" },
        flipkart: { id: "456", password: "456" },
        myntra: { id: "789", password: "789" },
        meesho: { id: "321", password: "321" },
        nykaa: { id: "654", password: "654" },
        pharmeasy: { id: "987", password: "987" }
    };

    if (
        credentials[platform] &&
        credentials[platform].id === id &&
        credentials[platform].password === password
    ) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.json({ success: false, message: "Invalid credentials" });
    }
});

// Register product
app.post("/register", async (req, res) => {
    const { brand, date, batch, price } = req.body;

    const data = brand + date + batch + price;

    const hash = crypto.createHash("sha256").update(data).digest("hex");

    database[hash] = { brand, date, batch, price };

    const qr = await QRCode.toDataURL(hash);

    res.json({
        message: "Product registered",
        hash,
        qr
    });
});

// Verify product
app.post("/verify", (req, res) => {
    const { hash } = req.body;

    if (database[hash]) {
        res.json({ valid: true, message: "Product is authentic" });
    } else {
        res.json({ valid: false, message: "Fake product" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});