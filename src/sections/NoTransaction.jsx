import React from 'react'
import transactions from '../assets/transaction.svg'
const NoTransaction = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <img src={transactions} style={{ width: "400px", margin: "4rem" }} alt='no_transaction'/>
      <p style={{ textAlign: "center", fontSize: "1.2rem", color: "white" }}>
        You Have No Transactions Currently
      </p>
    </div>
  )
}

export default NoTransaction