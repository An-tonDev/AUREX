const reconcileTransaction=require('./reconcile-transaction')
const findStaleTransaction=require('./findStaleTransaction')

async function runReconcileTransaction(){
          const staleTransactions= await findStaleTransaction

    for(transaction of staleTransactions){
        try{
           await reconcileTransaction(transaction)
           console.log('tranaction has been reconciled')
        }catch(err){
            console.log('could not reconcile transaction')
        }
    }
     }

module.exports=runReconcileTransaction