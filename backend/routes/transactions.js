import express from 'express';
import {
    initDatabase,
    listTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData,
} from '../controllers/transactionsController.js';

const router = express.Router();

router.get('/init', initDatabase);
router.get('/', listTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChartData);
router.get('/piechart', getPieChartData);
router.get('/combined', getCombinedData);

export default router;