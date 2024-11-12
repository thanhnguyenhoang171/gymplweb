const db = require("../data/mssql");
const { Sequelize, where } = require('sequelize');
const { uploadFileService } = require('../service/uploadFileService');
const e = require("express");
// GET Method (All)
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await db.Customers.findAll();
        res.status(200).json({
            message: "Retrieved all successfully.",
            data: customers
        });
    } catch (error) {
        console.error("Error fetching customers: ", error);
        res.status(500).json({ message: "Error fetching customers" });
    }
};

// GET Method (Details)
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await db.Customers.findByPk(req.query.id)
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: "Customer not found." });
        }
    } catch (error) {
        console.error("Error fetching customers: ", error);
        res.status(500).json({ message: "Error fetching customers" });
    }
}


// POST Method
exports.addCustomer = async (req, res) => {
    try {
        const { key } = req.query;
        const { CustomerName, Gender, DateofBirth, PhoneNumber, PackID, StaffID, Note } = req.body;

        console.log("Query parameter key: ", key);

        if (!CustomerName || !PhoneNumber || !PackID) {
            return res.status(400).json({
                message: "Please provide all required fields."
            })
        }

        // Convert DateofBirth to ISO format if it exists
        let formattedDateOfBirth = null;
        if (DateofBirth) {
            const parsedDate = new Date(DateofBirth);
            if (isNaN(parsedDate)) {
                return res.status(400).json({
                    message: "Invalid date format for DateofBirth."
                });
            }
            formattedDateOfBirth = parsedDate.toISOString(); // SQL Server understands this format
        }

        const customerData = {
            CustomerName,
            Gender,
            DateofBirth: formattedDateOfBirth,
            PhoneNumber,
            PackID,
            StaffID,
            Note
        };

        // const customer = await db.Customers.create(customerData);

        await db.sequelize.query(
            `INSERT INTO Customers (CustomerName, Gender, DateofBirth, PhoneNumber, PackID, StaffID, Note)
             VALUES (:CustomerName, :Gender, :DateofBirth, :PhoneNumber, :PackID, :StaffID, :Note)`,
            {
                replacements: customerData,
                type: Sequelize.QueryTypes.INSERT,
            }
        );

        const createdCustomer = await db.Customers.findOne({
            where: { PhoneNumber }, // Assuming PhoneNumber is unique
            order: [['Date_Added', 'DESC']] // Get the most recently added customer
        });

        res.status(201).json({
            message: "Customer created successfully.",
            data: createdCustomer,
            query: { key },
        });
    } catch (error) {
        console.error("Error creating customer: ", error);
        return res.status(500).json({
            message: "Error creating customer",
            details: error.errors ? error.errors.map(e => e.message) : error.message
        });
    }
}

// // PUT Method
// exports.updateCustomer = async (req, res) => {
//     try {
//         const id = req.query.id;
//         if (!id) {
//             return res.status(400).json({ message: "Customer UID is required." });
//         }

//         const { 
//             CustomerName, 
//             Gender, 
//             DateofBirth, 
//             PhoneNumber, 
//             PackID, 
//             StaffID,
//             Startdate, 
//             Note 
//         } = req.body;

//         // Format dates as SQL Server datetime strings
//         const customerData = {
//             CustomerName,
//             Gender,
//             DateofBirth: DateofBirth ? new Date(DateofBirth).toISOString().slice(0,10) : null,
//             PhoneNumber,
//             PackID,
//             StaffID,
//             Startdate: new Date().toISOString().slice(0,19).replace('T',' '),
//             Note
//         };

//         const [updated] = await db.Customers.update(customerData, {
//             where: { CustomerID: id }
//         });

//         if (updated) {
//             const updatedCustomer = await db.Customers.findOne({ 
//                 where: { CustomerID: id },
//                 raw: true 
//             });
//             res.status(200).json({ 
//                 message: "Customer updated successfully.", 
//                 data: updatedCustomer 
//             });
//         } else {
//             res.status(404).json({ message: "Customer not found." });
//         }
//     } catch (error) {
//         console.error("Error updating customer:", error);
//         res.status(500).json({ message: "Error updating customer" });
//     }
// };

// PUT Method
exports.updateCustomer = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: "Customer UID is required." });
        }

        // Add upload image for customer
        let imageURL = '';
        if (!req.files || Object.keys(req.files).length === 0) {
            //do nothing
        }
        else {
            let result = await uploadFileService(req.files.Image);
            imageURL = result.path;
        }

        const {
            CustomerName,
            Gender,
            DateofBirth,
            PhoneNumber,
            PackID,
            StaffID,
            Note,
        } = req.body;
        let imageCustomer = imageURL;

        const [updated] = await db.sequelize.query(
            `UPDATE Customers 
                SET CustomerName = :CustomerName,
                    Gender = :Gender,
                    DateofBirth = CONVERT(DATE, :DateofBirth),
                    PhoneNumber = :PhoneNumber,
                    PackID = :PackID,
                    StaffID = :StaffID,
                    Startdate = GETDATE(),
                    Note = :Note,
                    Date_Modified = GETDATE(),
                    Image = :imageCustomer
                WHERE CustomerID = :CustomerID`,
            {
                replacements: {
                    CustomerName,
                    Gender,
                    DateofBirth: DateofBirth || null,
                    PhoneNumber,
                    PackID,
                    StaffID,
                    Note,
                    CustomerID: id,
                    imageCustomer,
                },
                type: db.Sequelize.QueryTypes.UPDATE
            }
        );

        if (updated) {
            const [updatedCustomer] = await db.sequelize.query(
                'SELECT * FROM Customers WHERE CustomerID = :id',
                {
                    replacements: { id },
                    type: db.Sequelize.QueryTypes.SELECT
                }
            );

            res.status(200).json({
                message: "Customer updated successfully.",
                data: updatedCustomer
            });
        } else {
            res.status(404).json({ message: "Customer not found." });
        }
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(500).json({ message: "Error updating customer" });
    }
};

// DELETE Method
exports.deleteCustomer = async (req, res) => {
    try {
        const id = req.query.id;

        if (!id) {
            return res.status(400).json({ message: "Customer ID is required." });
        }

        console.log("Attempting to delete customer with ID:", id);

        // Check if customer exists before deletion
        const existingCustomer = await db.Customers.findOne({
            where: { CustomerID: id }
        });

        if (!existingCustomer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        // Perform deletion
        await db.Customers.destroy({
            where: { CustomerID: id }
        });

        return res.status(200).json({
            message: "Customer deleted successfully.",
            data: {
                CustomerID: id,
                CustomerName: existingCustomer.CustomerName
            }
        });

    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({
            message: "Error deleting customer",
            error: error.message
        });
    }
};

exports.uploadfileCustomer = async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send('No files were uploaded.');
            return;
        } else {
            const result = await uploadFileService(req.files.Image);
            console.log(">>> Check result = ", result);
            return res.status(200).json({
                message: "Upload file successfully!",
                path: result.path
            });
        }
    } catch (error) {
        console.log(">>> error upload file = ", error);
        return res.status(500).json({
            message: "Error uploading file",
            error: error.message
        })
    }
};