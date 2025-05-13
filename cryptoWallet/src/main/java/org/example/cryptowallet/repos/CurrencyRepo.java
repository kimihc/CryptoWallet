package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CurrencyRepo extends JpaRepository<Currency, Integer> {
    Optional<Currency> findByCurrencyName(String currencyName);
}