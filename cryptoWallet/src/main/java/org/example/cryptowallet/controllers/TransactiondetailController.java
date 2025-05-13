package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.TransactiondetailDTO;
import org.example.cryptowallet.mappers.TransactiondetailMapper;
import org.example.cryptowallet.models.Transaction;
import org.example.cryptowallet.models.Transactiondetail;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.TransactionService;
import org.example.cryptowallet.services.TransactiondetailService;
import org.example.cryptowallet.services.WalletService;
import org.example.cryptowallet.services.WalletbalanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/transactiondetails")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class TransactiondetailController {
    private final TransactiondetailService transactiondetailService;
    private final TransactionService transactionService;
    private final WalletbalanceService walletbalanceService;
    private final WalletService walletService;
    private final UserRepo userRepo;
    private final TransactiondetailMapper transactiondetailMapper;

    @PostMapping("/{transactionId}")
    public ResponseEntity<?> createTransactiondetail(@PathVariable Integer transactionId,
                                                     @RequestBody TransactiondetailDTO transactiondetailDTO,
                                                     Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Transaction transaction = transactionService.getTransactionById(transactionId);
            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(transaction.getWalletBalance().getId());
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no no no  MisterFish");
            }

            Transactiondetail transactiondetail = transactiondetailMapper.transactiondetailDTOToTransactiondetail(transactiondetailDTO);
            Transactiondetail createdDetail = transactiondetailService.createTransactiondetail(transactionId, transactiondetail);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(transactiondetailMapper.transactiondetailToTransactiondetailDTO(createdDetail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error create transacd: " + e.getMessage());
        }
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<?> getTransactiondetail(@PathVariable Integer transactionId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("user not found"));

            Transaction transaction = transactionService.getTransactionById(transactionId);
            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(transaction.getWalletBalance().getId());
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("no dost transac");
            }

            Transactiondetail transactiondetail = transactiondetailService.getTransactiondetailByTransactionId(transactionId);
            return ResponseEntity.ok(transactiondetailMapper.transactiondetailToTransactiondetailDTO(transactiondetail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error with transat get: " + e.getMessage());
        }
    }
}