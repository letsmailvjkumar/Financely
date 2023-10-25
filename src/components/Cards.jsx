import { Button, Card, Row} from 'antd'
import React from 'react'
import '../styles/Cards.css'
const Cards = ({showExpenseModal, showIncomeModal, currentBalance, totalIncome, totalExpense, reset}) => {
  
  

  return (
    <div>
      <Row className='flex flex-wrap  justify-between items-center mt-5 m-5 ms:m-auto ms:gap-16'>
        <Card title="Current Balance"
        className='shadow-lg min-w-[320px] h-36 font-montserrat'
        >
        <p>₹{currentBalance}</p>
        <Button className='my-button' block onClick={reset}>Reset Balance</Button>
        </Card>
        <Card title="Total Income"
        className='shadow-lg min-w-[320px] h-36 font-montserrat'
        >
        <p>₹{totalIncome}</p>
        <Button className='my-button' block onClick={showIncomeModal}>Add Income</Button>
        </Card>
        <Card title="Total Expenses"
        className='shadow-lg min-w-[320px] h-36 font-montserrat'
        >
        <p>₹{totalExpense}</p>
        <Button className='my-button' block onClick={showExpenseModal}>Add Expense</Button>
        </Card>
      </Row>
      </div>
  )
}

export default Cards