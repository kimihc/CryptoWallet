package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletaddress;
import org.example.cryptowallet.repos.WalletRepo;
import org.example.cryptowallet.repos.WalletaddressRepo;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class WalletaddressService {
    private final WalletaddressRepo walletaddressRepo;
    private final WalletRepo walletRepo;

    public WalletaddressService(WalletaddressRepo walletaddressRepo, WalletRepo walletRepo) {
        this.walletaddressRepo = walletaddressRepo;
        this.walletRepo = walletRepo;
    }

    public Walletaddress createWalletaddress(Integer walletId, Walletaddress walletaddress) {
        Wallet wallet = walletRepo.findById(walletId)
                .orElseThrow(() -> new NoSuchElementException("Wallet not found with id: " + walletId));
        walletaddress.setWallet(wallet);
        return walletaddressRepo.save(walletaddress);
    }

    public Walletaddress getWalletaddressByWalletId(Integer walletId) {
        return walletaddressRepo.findByWalletId(walletId)
                .orElseThrow(() -> new NoSuchElementException("Wallet address not found for wallet id: " + walletId));
    }
}