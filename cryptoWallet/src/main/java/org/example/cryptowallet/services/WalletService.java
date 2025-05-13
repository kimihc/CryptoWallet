package org.example.cryptowallet.services;

import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.repos.WalletRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class WalletService {
    private final WalletRepo walletRepo;
    private final UserRepo userRepo;

    public WalletService(WalletRepo walletRepo, UserRepo userRepo) {
        this.walletRepo = walletRepo;
        this.userRepo = userRepo;
    }

    public Wallet createWallet(Integer userId, Wallet wallet) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found with id: " + userId));
        wallet.setUser(user);
        return walletRepo.save(wallet);
    }

    public List<Wallet> getWalletsByUserId(Integer userId) {
        return walletRepo.findByUserId(userId);
    }

    public Wallet getWalletById(Integer walletId) {
        return walletRepo.findById(walletId)
                .orElseThrow(() -> new NoSuchElementException("Wallet not found with id: " + walletId));
    }

    @Transactional
    public Wallet updateWallet(Integer walletId, Wallet updatedWallet) {
        Wallet wallet = getWalletById(walletId);
        if (updatedWallet.getWalletName() != null && !updatedWallet.getWalletName().trim().isEmpty()) {
            wallet.setWalletName(updatedWallet.getWalletName());
        }
        return walletRepo.save(wallet);
    }
}