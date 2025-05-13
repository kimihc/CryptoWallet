package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Walletbalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletbalanceRepo extends JpaRepository<Walletbalance, Integer> {
    List<Walletbalance> findByWalletId(Integer walletId);
}