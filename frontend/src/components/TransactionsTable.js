import React, { useState } from 'react';

const TransactionsTable = ({ transactions, onSearch }) => {
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        onSearch(e.target.value); // Pass the search term to the parent component
    };

    return (
        <div className="transactions-table">
            {/* {/ Search Input /} */}
            <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={handleSearch}
                className="search-input"
            />

            {/* {/ Transactions Table /} */}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Date of Sale</th>
                        <th>Sold</th>
                        <th>Category</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>{transaction.category || 'N/A'}</td>
                                <td>
                                    <img
                                        src={transaction.image}
                                        alt={transaction.title}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No transactions found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;

