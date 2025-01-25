import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import cors from "cors";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

let partners = [];

app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    partners = data.map(row => ({
        company: row.Company || "",
        type: row.Type || "",
        website: row.Website || ""
    }));

    fs.unlinkSync(req.file.path); // Remove file after processing
    res.json(partners);
});

app.get("/api/partners", (req, res) => {
    res.json(partners);
});

app.listen(5001, () => console.log("Server running on port 5001"));
