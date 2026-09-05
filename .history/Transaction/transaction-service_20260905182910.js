const { ValidationError, AppError, NotFoundError } = require('../utils/AppError')
const transactionRepository=require('./transaction-repository')


const createTransaction=async(data)=>{
 
    if(!data){
        throw new ValidationError('data cannot be null')
    }

  const transaction= await transactionRepository.createTransaction(data)

     if(!transaction){
         throw new AppError('unable to create transaction',400)
     }

     return transaction
}

const updateTransaction=async (id,data)=>{
  
    const transaction= await getTransactionById(id)
    const transaction= await transactionRepository.updateTransaction(transaction.id,data)
     return transaction
}

const getTransactionById=async(id)=>{
      const transaction= await transactionRepository.getTransaction(id)

      if(!transaction){
        throw new NotFoundError('transaction not found')
      }
      return transaction
}

const getTransactionByReference=async(data)=>{
         
    const transaction= await transactionRepository.getTransactionByReference(data)
      if(!transaction){
        throw new NotFoundError('transaction with this refrence not found')
      }
      return transaction     
}


module.exports={createTransaction,updateTransaction,
    getTransactionByReference,getTransactionById}