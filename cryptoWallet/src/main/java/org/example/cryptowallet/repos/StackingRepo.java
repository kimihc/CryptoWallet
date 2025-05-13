package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Stacking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StackingRepo extends JpaRepository<Stacking, Integer> {
    Optional<Stacking> findByWalletBalanceId(Integer walletBalanceId);
}