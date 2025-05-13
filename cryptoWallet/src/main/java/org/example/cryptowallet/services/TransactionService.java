package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Transaction;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.TransactionRepo;
import org.example.cryptowallet.repos.WalletbalanceRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TransactionService {
    private final TransactionRepo transactionRepo;
    private final WalletbalanceRepo walletbalanceRepo;

    public TransactionService(TransactionRepo transactionRepo, WalletbalanceRepo walletbalanceRepo) {
        this.transactionRepo = transactionRepo;
        this.walletbalanceRepo = walletbalanceRepo;
    }

    public Transaction createTransaction(Integer walletBalanceId, Transaction transaction) {
        Walletbalance walletBalance = walletbalanceRepo.findById(walletBalanceId)
                .orElseThrow(() -> new NoSuchElementException("WalletBalance not found with id: " + walletBalanceId));
        transaction.setWalletBalance(walletBalance);
        return transactionRepo.save(transaction);
    }

    public List<Transaction> getTransactionsByWalletBalanceId(Integer walletBalanceId) {
        return transactionRepo.findByWalletBalanceId(walletBalanceId);
    }

    public Transaction getTransactionById(Integer transactionId) {
        return transactionRepo.findById(transactionId)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found with id: " + transactionId));
    }
}