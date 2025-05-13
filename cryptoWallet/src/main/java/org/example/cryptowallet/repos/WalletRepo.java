package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletRepo extends JpaRepository<Wallet, Integer> {
    List<Wallet> findByUserId(Integer userId);
}