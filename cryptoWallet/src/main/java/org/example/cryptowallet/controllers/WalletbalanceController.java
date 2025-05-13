package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.WalletbalanceDTO;
import org.example.cryptowallet.mappers.WalletbalanceMapper;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.WalletService;
import org.example.cryptowallet.services.WalletbalanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.cryptowallet.DTO.ErrorResponse;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/walletbalances")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class WalletbalanceController {
    private final WalletbalanceService walletbalanceService;
    private final WalletService walletService;
    private final UserRepo userRepo;
    private final WalletbalanceMapper walletbalanceMapper;

    @PostMapping("/{walletId}/{currencyId}")
    public ResponseEntity<?> createWalletbalance(@PathVariable Integer walletId,
                                                 @PathVariable Integer currencyId,
                                                 @RequestBody WalletbalanceDTO walletbalanceDTO,
                                                 Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Wallet wallet = walletService.getWalletById(walletId);
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("wallet ne polzovatelya");
            }

            Walletbalance walletbalance = walletbalanceMapper.walletbalanceDTOToWalletbalance(walletbalanceDTO);
            Walletbalance createdBalance = walletbalanceService.createWalletbalance(walletId, currencyId, walletbalance);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(walletbalanceMapper.walletbalanceToWalletbalanceDTO(createdBalance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Exception with create wallet: " + e.getMessage());
        }
    }

    @GetMapping("/wallet/{walletId}")
    public ResponseEntity<?> getWalletbalances(@PathVariable Integer walletId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("user not found"));

            Wallet wallet = walletService.getWalletById(walletId);
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("net dostupa");
            }

            List<Walletbalance> balances = walletbalanceService.getWalletbalancesByWalletId(walletId);
            return ResponseEntity.ok(walletbalanceMapper.walletbalancesToWalletbalanceDTOs(balances));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("walletBalance get exception: " + e.getMessage());
        }
    }

    @PutMapping("/{balanceId}")
    public ResponseEntity<?> updateWalletbalance(@PathVariable Integer balanceId, @RequestBody WalletbalanceDTO walletbalanceDTO, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("Пользователь не найден"));

            Walletbalance walletbalance = walletbalanceService.getWalletbalanceById(balanceId);
            Wallet wallet = walletService.getWalletById(walletbalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("ACCESS_DENIED", "Нет доступа к кошельку", Instant.now().toEpochMilli()));
            }

            Walletbalance updatedBalance = walletbalanceMapper.walletbalanceDTOToWalletbalance(walletbalanceDTO);
            Walletbalance result = walletbalanceService.updateWalletbalance(balanceId, updatedBalance);
            return ResponseEntity.ok(walletbalanceMapper.walletbalanceToWalletbalanceDTO(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("BALANCE_UPDATE_FAILED", e.getMessage(), Instant.now().toEpochMilli()));
        }
    }
}