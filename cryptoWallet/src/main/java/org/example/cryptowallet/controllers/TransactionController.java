package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.TransactionDTO;
import org.example.cryptowallet.mappers.TransactionMapper;
import org.example.cryptowallet.models.Transaction;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.TransactionService;
import org.example.cryptowallet.services.WalletService;
import org.example.cryptowallet.services.WalletbalanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class TransactionController {
    private final TransactionService transactionService;
    private final WalletbalanceService walletbalanceService;
    private final WalletService walletService;
    private final UserRepo userRepo;
    private final TransactionMapper transactionMapper;

    @PostMapping("/{walletBalanceId}")
    public ResponseEntity<?> createTransaction(@PathVariable Integer walletBalanceId,
                                               @RequestBody TransactionDTO transactionDTO,
                                               Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(walletBalanceId);
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("not dostup");
            }

            Transaction transaction = transactionMapper.transactionDTOToTransaction(transactionDTO);
            Transaction createdTransaction = transactionService.createTransaction(walletBalanceId, transaction);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(transactionMapper.transactionToTransactionDTO(createdTransaction));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error with transact: " + e.getMessage());
        }
    }

    @GetMapping("/walletBalance/{walletBalanceId}")
    public ResponseEntity<?> getTransactions(@PathVariable Integer walletBalanceId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(walletBalanceId);
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("walletBalance is not dost");
            }

            List<Transaction> transactions = transactionService.getTransactionsByWalletBalanceId(walletBalanceId);
            return ResponseEntity.ok(transactionMapper.transactionsToTransactionDTOs(transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error with get transactv: " + e.getMessage());
        }
    }
}