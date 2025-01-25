import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

let partners = [];

// ✅ Load the Excel file at server startup
import { fileURLToPath } from "url";
import { dirname } from "path";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Correct file path
const excelFilePath = path.join(__dirname, "Partners List.xlsx");


try {
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    partners = data.map(row => ({
        company: row.Company || "",
        type: row.Type || "",
        website: row.Website || ""
    }));

    console.log("✅ Loaded Data:", partners.length, "records");
} catch (error) {
    console.error("❌ Error loading Excel file:", error);
}

// ✅ Upload endpoint for new Excel files
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

// ✅ API route to get partners data
app.get("/api/partners", (req, res) => {
    res.json(partners);
});

app.listen(5001, () => console.log("🚀 Server running on port 5001"));
