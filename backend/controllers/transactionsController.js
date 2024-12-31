import axios from 'axios';
import ProductTransaction from '../models/ProductTransaction.js';

// Initialize DB with seed data
export const initDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await ProductTransaction.insertMany(response.data);
        res.json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};

// List all transactions with search and pagination
export const listTransactions = async (req, res) => {
    const { search, page = 1, perPage = 10, month } = req.query;

    const searchFilter = search ? {
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: search }
        ]
    } : {};

    // Use the month value to filter by the month part of the date
    const monthFilter = {
        $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
        }
    };

    try {
        const transactions = await ProductTransaction.find({
            ...searchFilter,
            ...monthFilter
        })
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

// Statistics API
export const getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        // Use the month value to filter by the month part of the date
        const monthFilter = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, parseInt(month)]
            }
        };

        // Calculate total sale amount for the selected month
        const totalSaleAmount = await ProductTransaction.aggregate([
            { $match: monthFilter },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        // Count total sold and not sold items for the selected month
        const soldItems = await ProductTransaction.countDocuments({
            sold: true,
            ...monthFilter
        });

        const notSoldItems = await ProductTransaction.countDocuments({
            sold: false,
            ...monthFilter
        });

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
            soldItems,
            notSoldItems
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Bar chart API
export const getBarChartData = async (req, res) => {
    const { month } = req.query;

    try {
        // Convert the month from string to integer
        const monthInt = parseInt(month);

        // Use $expr to filter by the month of dateOfSale
        const monthFilter = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthInt]
            }
        };

        // Aggregating the price ranges using $bucket
        const priceRanges = await ProductTransaction.aggregate([
            { $match: monthFilter },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
                    default: "901+",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        res.json(priceRanges);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'Failed to fetch bar chart data' });
    }
};


// Pie chart API
export const getPieChartData = async (req, res) => {
    const { month } = req.query;

    try {
        // Convert the month from string to integer
        const monthInt = parseInt(month);
        
        // Filter for transactions that match the specified month
        const monthFilter = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthInt]
            }
        };

        // Aggregating unique categories and counting the number of items in each category
        const categoryCounts = await ProductTransaction.aggregate([
            { $match: monthFilter },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(categoryCounts);
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: 'Failed to fetch pie chart data' });
    }
};


// Combine all API data
export const getCombinedData = async (req, res) => {
    const statistics = await getStatistics(req, res);
    const barChartData = await getBarChartData(req, res);
    const pieChartData = await getPieChartData(req, res);

    res.json({ statistics, barChartData, pieChartData });
};