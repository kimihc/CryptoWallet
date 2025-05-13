package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Stacking;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.StackingRepo;
import org.example.cryptowallet.repos.WalletbalanceRepo;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class StackingService {
    private final StackingRepo stackingRepo;
    private final WalletbalanceRepo walletbalanceRepo;

    public StackingService(StackingRepo stackingRepo, WalletbalanceRepo walletbalanceRepo) {
        this.stackingRepo = stackingRepo;
        this.walletbalanceRepo = walletbalanceRepo;
    }

    public Stacking createStacking(Integer walletBalanceId, Stacking stacking) {
        Walletbalance walletBalance = walletbalanceRepo.findById(walletBalanceId)
                .orElseThrow(() -> new NoSuchElementException("Wallet id: " + walletBalanceId));

        if (stackingRepo.findByWalletBalanceId(walletBalanceId).isPresent()) {
            throw new IllegalArgumentException("Stacking is already exists");
        }

        stacking.setWalletBalance(walletBalance);
        return stackingRepo.save(stacking);
    }

    public Stacking getStackingByWalletBalanceId(Integer walletBalanceId) {
        return stackingRepo.findByWalletBalanceId(walletBalanceId)
                .orElseThrow(() -> new NoSuchElementException("Stacking with id: " + walletBalanceId));
    }
}