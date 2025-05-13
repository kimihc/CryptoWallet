package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Transaction;
import org.example.cryptowallet.models.Transactiondetail;
import org.example.cryptowallet.repos.TransactionRepo;
import org.example.cryptowallet.repos.TransactiondetailRepo;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class TransactiondetailService {
    private final TransactiondetailRepo transactiondetailRepo;
    private final TransactionRepo transactionRepo;

    public TransactiondetailService(TransactiondetailRepo transactiondetailRepo, TransactionRepo transactionRepo) {
        this.transactiondetailRepo = transactiondetailRepo;
        this.transactionRepo = transactionRepo;
    }

    public Transactiondetail createTransactiondetail(Integer transactionId, Transactiondetail transactiondetail) {
        Transaction transaction = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new NoSuchElementException("Transaction not found with id: " + transactionId));
        if (transactiondetailRepo.findByTransactionId(transactionId).isPresent()) {
            throw new IllegalArgumentException("gg already exists");
        }
        transactiondetail.setTransaction(transaction);
        return transactiondetailRepo.save(transactiondetail);
    }

    public Transactiondetail getTransactiondetailByTransactionId(Integer transactionId) {
        return transactiondetailRepo.findByTransactionId(transactionId)
                .orElseThrow(() -> new NoSuchElementException("not found detail id: " + transactionId));
    }
}