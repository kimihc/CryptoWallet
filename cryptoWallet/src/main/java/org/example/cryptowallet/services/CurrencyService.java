package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Currency;
import org.example.cryptowallet.repos.CurrencyRepo;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class CurrencyService {
    private final CurrencyRepo currencyRepo;

    public CurrencyService(CurrencyRepo currencyRepo) {
        this.currencyRepo = currencyRepo;
    }

    public Currency createCurrency(Currency currency) {
        if (currencyRepo.findByCurrencyName(currency.getCurrencyName()).isPresent()) {
            throw new IllegalArgumentException("Currency not found");
        }
        return currencyRepo.save(currency);
    }

    public Currency getCurrencyById(Integer currencyId) {
        return currencyRepo.findById(currencyId)
                .orElseThrow(() -> new NoSuchElementException("Currency ith id: " + currencyId));
    }

    public Currency getCurrencyByName(String currencyName) {
        return currencyRepo.findByCurrencyName(currencyName)
                .orElseThrow(() -> new NoSuchElementException("Currency with name: " + currencyName));
    }
}