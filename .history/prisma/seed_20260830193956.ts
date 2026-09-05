const {prisma}=require('./client')
import {faker} from "@faker-js/faker"

console.log('prisma object:', prisma);
console.log('prisma.user:', prisma?.user)


async function main() {
    
    await prisma.user.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.wallet.deleteMany()
    await prisma.ledgerEntry.deleteMany()
    await prisma.session.deleteMany()

    faker.seed(42)

    const users=[]

    for(let i=0; i<20; i++){
      const user= await prisma.user.create({
        data:{
           email: faker.internet.email(),
           passwordHash:'hashed-password-placeholder',
           phoneNumber:faker.phone.number({style:'international'}),
           kycStatus:faker.helpers.arrayElement(['VERIFIED','PENDING','REJECTED']),
           tier:faker.helpers.arrayElement(['TIER_1','TIER_2','TIER_3'])
        }
      })

      users.push(user)
    }

    const wallets=[]

    for(const user of users){
     const wallet= await prisma.wallet.create({
      data:{
        walletNo:`WAL-${String(user.id).padStart(4,'0')}`,
        balance: faker.number.int({min:100000, max:5000000}),
        currency:'NGN',
        userId:user.id,
        status:faker.helpers.arrayElement(['BLOCKED','ACTIVE'])
      }
     })

     wallets.push(wallet)
    }

    //transaction
    for (let i=0;i<30;i++){

     const sender=faker.helpers.arrayElement(wallets)
     let receiver=faker.helpers.arrayElement(wallets)

     while( sender.id === receiver.id){
       receiver=faker.helpers.arrayElement(wallets)
     }
     const transaction= await prisma.transaction.create({
      data:{
        senderWalletId:sender.id,
        receiverWalletId:receiver.id,
        amount: faker.number.int({min:30000, max:500000}),
        currency:'NGN',
        reference:`REF-${faker.string.alphanumeric(8)}`,
        type:'TRANSFER',
        status:'SUCCESS',
        description:`${sender.id} sent money to ${receiver.id}`
      }
     })

     //entry into the ledger

     await prisma.ledgerEntry.createMany({
      data:[{
        transactionId:transaction.id,
        walletId:sender.id,
        type:'DEBIT',
        currrency:'NGN',
        amount:transaction.amount
      }
     ,{
        transactionId:transaction.id,
        walletId:receiver.id,
        type:'CREDIT',
        currrency:'NGN',
        amount:transaction.amount
      }]
     })
    }

  console.log('Seed complete.');
 
}

main().catch((e)=>{
    console.error(e)
    process.exit(1)
}).finally(async ()=>{
    await prisma.$disconnect()
})

