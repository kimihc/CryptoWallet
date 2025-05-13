package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.ErrorResponse;
import org.example.cryptowallet.DTO.WalletDTO;
import org.example.cryptowallet.DTO.WalletaddressDTO;
import org.example.cryptowallet.mappers.WalletMapper;
import org.example.cryptowallet.mappers.WalletaddressMapper;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletaddress;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.WalletService;
import org.example.cryptowallet.services.WalletaddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;
import java.time.Instant;

@RestController
@RequestMapping("/wallets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class WalletController {
    private final WalletService walletService;
    private final WalletaddressService walletaddressService;
    private final WalletMapper walletMapper;
    private final WalletaddressMapper walletaddressMapper;
    private final UserRepo userRepo;

    @PostMapping
    public ResponseEntity<?> createWallet(@RequestBody WalletDTO walletDTO, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Wallet wallet = walletMapper.walletDTOToWallet(walletDTO);
            Wallet createdWallet = walletService.createWallet(user.getId(), wallet);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(walletMapper.walletToWalletDTO(createdWallet));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating wallet: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getWalletsForUser(Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            List<Wallet> wallets = walletService.getWalletsByUserId(user.getId());
            return ResponseEntity.ok(walletMapper.walletsToWalletDTOs(wallets));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving wallets: " + e.getMessage());
        }
    }

    @PostMapping("/{walletId}/address")
    public ResponseEntity<?> createWalletaddress(@PathVariable Integer walletId,
                                                 @RequestBody WalletaddressDTO walletaddressDTO,
                                                 Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Wallet wallet = walletService.getWalletById(walletId);
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access to wallet");
            }

            Walletaddress walletaddress = walletaddressMapper.walletaddressDTOToWalletaddress(walletaddressDTO);
            Walletaddress createdAddress = walletaddressService.createWalletaddress(walletId, walletaddress);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(walletaddressMapper.walletaddressToWalletaddressDTO(createdAddress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating wallet address: " + e.getMessage());
        }
    }

    @GetMapping("/{walletId}/address")
    public ResponseEntity<?> getWalletaddress(@PathVariable Integer walletId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Wallet wallet = walletService.getWalletById(walletId);
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access to wallet");
            }

            Walletaddress walletaddress = walletaddressService.getWalletaddressByWalletId(walletId);
            return ResponseEntity.ok(walletaddressMapper.walletaddressToWalletaddressDTO(walletaddress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving wallet address: " + e.getMessage());
        }
    }

    @PutMapping("/{walletId}")
    public ResponseEntity<?> updateWallet(@PathVariable Integer walletId, @RequestBody WalletDTO walletDTO, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("Пользователь не найден"));

            Wallet wallet = walletService.getWalletById(walletId);
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("ACCESS_DENIED", "Нет доступа к кошельку", Instant.now().toEpochMilli()));
            }

            Wallet updatedWallet = walletMapper.walletDTOToWallet(walletDTO);
            Wallet result = walletService.updateWallet(walletId, updatedWallet);
            return ResponseEntity.ok(walletMapper.walletToWalletDTO(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("WALLET_UPDATE_FAILED", e.getMessage(), Instant.now().toEpochMilli()));
        }
    }
}