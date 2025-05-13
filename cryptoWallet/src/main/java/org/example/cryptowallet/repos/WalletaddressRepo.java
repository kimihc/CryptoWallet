package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Walletaddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletaddressRepo extends JpaRepository<Walletaddress, Integer> {
    Optional<Walletaddress> findByWalletId(Integer walletId);
}