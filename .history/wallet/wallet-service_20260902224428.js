const { NotFoundError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')


const addBalance=(data)=>{
            
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