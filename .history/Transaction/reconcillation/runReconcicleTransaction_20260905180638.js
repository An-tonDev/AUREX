const reconcileTransaction=require('./reconcile-transaction')
const findStaleTransaction=require('./findStaleTransaction')

async function runReconcileTransaction(){

          const staleTransactions= await findStaleTransaction()
          console.log(`found ${staleTransactions.length} that are pending`)

    for(transaction of staleTransactions){
        try{
           await reconcileTransaction(transaction)
           console.log(`tranaction ${transaction.reference} has been reconciled`)
        }catch(err){

            console.log(`could not reconcile transaction ${transaction.reference}`,err.message)
        }
    }
     }

module.exports=runReconcileTransaction