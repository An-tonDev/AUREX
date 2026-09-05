const { NotFoundError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')


const addBalance=(data)=>{

   const wallet=getWallet(data.id)

   const newBalance= wallet.balance +data.amount
     
   updateWallet(wallet.id,{balance:newBalance})
     

}

const getWallet=async (id)=>{
    const wallet= await walletRepository.getWallet(id)

    if(!wallet){
        throw new NotFoundError('wallet does not exist')
    }

    return wallet
}

const updateWallet=async(id,data)=>{
    getWallet(id)

    await walletRepository.updateWallet(id,data)

}