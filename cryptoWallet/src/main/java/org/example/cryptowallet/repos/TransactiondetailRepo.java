package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Transactiondetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactiondetailRepo extends JpaRepository<Transactiondetail, Integer> {
    Optional<Transactiondetail> findByTransactionId(Integer transactionId);
}