const { NotFoundError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')
const paystack=require('../utils/paystack')

//import transaction and what is needed

const addBalance=(id,data)=>{

//get wallet

//

 // store payment reference

  //intialize paystack with mail,amount in kobo,reference and a callbackurl

  //create webook controller where the update wallet is done after payment confirmed
            
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

module.exports={addBalance}