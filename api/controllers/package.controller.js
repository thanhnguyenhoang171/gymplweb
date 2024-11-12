const db = require('../data/mssql');

// Get
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await db.Packages.findAll();
        res.json(packages);
    } catch (error) {
        console.error("Error fetching packages: ", error);
        res.status(500).json({ message: "Error fetching packages" });
    }
}