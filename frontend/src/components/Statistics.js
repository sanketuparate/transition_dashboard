import React from 'react';

const Statistics = ({ statistics }) => {
    return (
        <div className="statistics">
            <h2>Statistics</h2>
            <div>Total Sales Amount: ${statistics.totalSaleAmount}</div>
            <div>Sold Items: {statistics.soldItems}</div>
            <div>Not Sold Items: {statistics.notSoldItems}</div>
        </div>
    );
};

export default Statistics;