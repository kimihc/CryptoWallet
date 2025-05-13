package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Currency;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.CurrencyRepo;
import org.example.cryptowallet.repos.WalletRepo;
import org.example.cryptowallet.repos.WalletbalanceRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class WalletbalanceService {
    private final WalletbalanceRepo walletbalanceRepo;
    private final WalletRepo walletRepo;
    private final CurrencyRepo currencyRepo;

    public WalletbalanceService(WalletbalanceRepo walletbalanceRepo, WalletRepo walletRepo, CurrencyRepo currencyRepo) {
        this.walletbalanceRepo = walletbalanceRepo;
        this.walletRepo = walletRepo;
        this.currencyRepo = currencyRepo;
    }

    public Walletbalance createWalletbalance(Integer walletId, Integer currencyId, Walletbalance walletbalance) {
        Wallet wallet = walletRepo.findById(walletId)
                .orElseThrow(() -> new NoSuchElementException("Wallet with id: " + walletId));
        Currency currency = currencyRepo.findById(currencyId)
                .orElseThrow(() -> new NoSuchElementException("Currency with id: " + currencyId));

        walletbalance.setWallet(wallet);
        walletbalance.setCurrency(currency);
        return walletbalanceRepo.save(walletbalance);
    }

    public List<Walletbalance> getWalletbalancesByWalletId(Integer walletId) {
        return walletbalanceRepo.findByWalletId(walletId);
    }

    public Walletbalance getWalletbalanceById(Integer balanceId) {
        return walletbalanceRepo.findById(balanceId)
                .orElseThrow(() -> new NoSuchElementException("Walletbalance with id: " + balanceId));
    }

    @Transactional
    public Walletbalance updateWalletbalance(Integer balanceId, Walletbalance updatedBalance) {
        Walletbalance walletbalance = getWalletbalanceById(balanceId);
        if (updatedBalance.getBalance() != null && updatedBalance.getBalance().compareTo(BigDecimal.ZERO) >= 0) {
            walletbalance.setBalance(updatedBalance.getBalance());
        }
        if (updatedBalance.getAmount() != null && updatedBalance.getAmount().compareTo(BigDecimal.ZERO) >= 0) {
            walletbalance.setAmount(updatedBalance.getAmount());
        }

        return walletbalanceRepo.save(walletbalance);
    }
}