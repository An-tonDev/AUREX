import { PrismaClient } from "@prisma/client";

const prisma= new PrismaClient()


async function main() {
    
    await prisma.user.deleteMany()
    await prisma.transaction.deleteMany()
    await prisma.wallet.deleteMany()
    await prisma.ledgerEntry.deleteMany()
    await prisma.session.deleteMany()

    const ada = await prisma.user.create({
    data: {
      email: 'ada@test.com',
      passwordHash: 'hashed_password_placeholder',
      phoneNumber: '+2348011111111',
      kycStatus: 'VERIFIED',
      tier: 'TIER_2',
    },
  });

      
  const chidi = await prisma.user.create({
    data: {
      email: 'chidi@test.com',
      passwordHash: 'hashed_password_placeholder',
      phoneNumber: '+2348022222222',
      kycStatus: 'PENDING',
      tier: 'TIER_1',
    },
  });

  // Step C: create wallets for each user
  const adaWallet = await prisma.wallet.create({
    data: {
      walletNo: 'WAL-0001',
      balance: 500000, // 5,000.00 NGN in kobo
      currency: 'NGN',
      userId: ada.id,
      status: 'ACTIVE',
    },
  });

  const chidiWallet = await prisma.wallet.create({
    data: {
      walletNo: 'WAL-0002',
      balance: 1200050, // 12,000.50 NGN in kobo
      currency: 'NGN',
      userId: chidi.id,
      status: 'ACTIVE',
    },
  });

  // Step D: create one transaction between them
  const txn = await prisma.transaction.create({
    data: {
      senderWalletId: adaWallet.id,
      receiverWalletId: chidiWallet.id,
      amount: 50000, // 500.00 NGN
      currency: 'NGN',
      reference: 'TEST-REF-0001',
      type: 'TRANSFER',
      status: 'SUCCESS',
      description: 'Test transfer seed data',
    },
  });

  // Step E: create matching ledger entries (debit sender, credit receiver)
  await prisma.ledgerEntry.create({
    data: {
      transactionId: txn.id,
      walletId: adaWallet.id,
      type: 'DEBIT',
      currrency: 'NGN', // matches your current schema's typo — rename together later
      amount: 50000,
    },
  });

  await prisma.ledgerEntry.create({
    data: {
      transactionId: txn.id,
      walletId: chidiWallet.id,
      type: 'CREDIT',
      currrency: 'NGN',
      amount: 50000,
    },
  });

  console.log('Seed complete.');
  console.log({ ada, chidi, adaWallet, chidiWallet, txn });
}

main().catch((e)=>{
    console.error(e)
    process.exit(1)
}).finally(async ()=>{
    await prisma.$disconnect()
})

