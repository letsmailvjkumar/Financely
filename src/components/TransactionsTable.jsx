import React, { useState } from 'react'
import { Table, Select, Radio } from 'antd';
import { unparse, parse } from 'papaparse';
import { toast } from 'react-toastify'; 
const TransactionsTable = ({transactions, addTransaction, fetchTransactions}) => {
    const[search, setSearch] = useState("")
    const[typeFilter, setTypeFilter] = useState('')
    const[sortKey,setSortKey]=useState('')

    const { Option } = Select
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
      ];

    // function for filter
    let filteredTransactions = transactions.filter((item)=>
    item.name.toLowerCase().includes(search.toLowerCase()) && 
    item.type.includes(typeFilter))

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
          return new Date(a.date) - new Date(b.date);
        } 
        else if (sortKey === "amount") {
          return a.amount - b.amount;
        } 
        else {
          return 0;
        }
      })

      function exportCSV(){
        var csv = unparse({
          fields: ["name", "type", "tag", "date", "amount"],
          data: transactions, 
        });
        const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a")
        link.href = url;
        link.download = 'transactions.csv';
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      function importFromCsv(event) {
        event.preventDefault();
        try {
          parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
              console.log("Results-->", results)
              // Now results.data is an array of objects representing your CSV rows
              for (const transaction of results.data) {
                // Write each transaction to Firebase, you can use the addTransaction function here
                console.log("Transactions", transaction);
                const newTransaction = {
                  ...transaction,
                  amount: parseFloat(transaction.amount),
                };
                await addTransaction(newTransaction, true);
              }
            },
          });
           toast.success("All Transactions Added");
           fetchTransactions();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }
    

  return (
    <div className='m-6'>
    <div className='flex flex-wrap justify-between items-center'>
    <div>
    <input 
    className=' w-[80vw] border-[1.5px] outline-none pl-2 m-auto shadow-lg mt-1 mb-1 rounded-lg p-[2px]'
    value={search} 
    onChange={(e)=>setSearch(e.target.value)} 
    placeholder='Seach By Name' />
    </div>
    <div>
    <Select
      className='shadow-lg'
      onChange={(value)=>setTypeFilter(value)}
      value={typeFilter}
      placeholder="Filter"
      allowClear
    >
        <Option value="">Recent</Option>
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>
    </Select>
    </div>
    </div>
    <h3 className='text-center text-xl font-semibold mt-3'>History Transactions</h3>
    <div className='flex justify-between items-center mt-5 mb-3'>
        
        <div>
            <Radio.Group 
                className='me-20'
                onChange={(e)=>setSortKey(e.target.value)}
                value={sortKey}
            >
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort By Date</Radio.Button>
                <Radio.Button value="amount">Sort By Amount</Radio.Button>
            </Radio.Group>
        </div>
        <div className='flex justify-end gap-5 items-center w-[400px]'>
          <div>
          <button className="relative border-2 border-gray-800 bg-transparent px-1.5 font-normal uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100" onClick={exportCSV}>Export to CSV</button>
          </div>
          <div>
          <label for='file-csv' className="relative border-2 border-gray-800 bg-transparent px-1.5 font-normal uppercase text-gray-800 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-gray-800 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
            Import from CSV
          </label>
          <input
            id='file-csv'
            type='file'
            accept='.csv'
            onChange={importFromCsv}
            required
            className='hidden'
            />
          </div>
       </div>
    </div>
   
    <Table dataSource={sortedTransactions} columns={columns}/>
    </div>
  )
}

export default TransactionsTable