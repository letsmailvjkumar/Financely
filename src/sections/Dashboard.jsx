import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import Cards from '../components/Cards'
import AddIncome from '../components/AddIncome'
import AddExpense from '../components/AddExpense'
import { addDoc, collection, getDocs, query, deleteDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { toast } from 'react-toastify'
import TransactionsTable from '../components/TransactionsTable'
import Chart from '../components/Chart'
import NoTransaction from './NoTransaction'
const Dashboard = () => {

const [user] = useAuthState(auth)
const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false)
const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false)
const [transactions, setTransactions] = useState([])
const [loading, setLoading] = useState(false)
const [currentBalance, setCurrentBalance] = useState(0)
const [totalIncome, setTotalIncome] = useState(0)
const [totalExpense, setTotalExpense] = useState(0)


const showExpenseModal = ()=>{
    setIsExpenseModalVisible(true)
}
const showIncomeModal = ()=>{
    setIsIncomeModalVisible(true)
}
const handleExpenseCancel = ()=>{
    setIsExpenseModalVisible(false)
}
const handleIncomeCancel = ()=>{ 
    setIsIncomeModalVisible(false)
}

useEffect(()=> {
    fetchTransactions()
},[user])

async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log(transactions)
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  function calculateBalance(){
    let incomeTotal = 0
    let expenseTotal = 0


    transactions.forEach((transaction)=> {
        if(transaction.type === 'income'){
            incomeTotal +=transaction.amount
        } else {
            expenseTotal += transaction.amount
        }
    })

    setTotalIncome(incomeTotal)
    setTotalExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
  }

  // Calculate the initial balance, income, and expenses
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  
  const onFinish = (values, type) => {
    const newTransaction = {
        type: type,
        date: values.date.format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        tag: values.tag,
        name: values.name,
      };
      addTransaction(newTransaction);
    }
  async function addTransaction(transaction, many) {
        try {
          const docRef = await addDoc(
            collection(db, `users/${user.uid}/transactions`),
            transaction
          );
          console.log("Document written with ID: ", docRef.id);
            
          if (!many) toast.success("Transaction Added!");
          let newArr = transactions
          newArr.push(transaction)
          setTransactions(newArr)
          calculateBalance()
        } catch (e) {
          console.error("Error adding document: ", e);
          
          if (!many) toast.error("Couldn't add transaction");

          
        }
  }

  async function reset() {
    try {
      // First, delete all transactions in the database
      const transactionCollectionRef = collection(db, `users/${user.uid}/transactions`);
      const querySnapshot = await getDocs(transactionCollectionRef);
      
      // Iterate through the documents and delete them one by one
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      // After deleting the data in the database, reset the state variables
      setTransactions([]);
      setTotalIncome(0);
      setTotalExpense(0);
      setCurrentBalance(0);
  
      toast.success("Data reset successfully");
    } catch (error) {
      console.error("Error resetting data: ", error);
      toast.error("Couldn't reset data");
    }
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  }
  ) 
return (
    <div>
        <NavBar />
        {
        loading?<p>loading..</p>:
        <>
        <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal = {showIncomeModal}
        currentBalance={currentBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        reset={reset}
        />
        <AddExpense
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncome
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />
        {
          transactions && transactions.length!=0 ? < Chart sortedTransactions={sortedTransactions}/> :
          <NoTransaction/>
          
        }
        
        <TransactionsTable transactions={transactions}  addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        </>
        }
        
    </div>
  )
}

export default Dashboard