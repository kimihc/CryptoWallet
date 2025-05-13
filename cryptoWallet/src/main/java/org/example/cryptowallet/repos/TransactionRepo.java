package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByWalletBalanceId(Integer walletBalanceId);
}