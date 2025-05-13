package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.StackingDTO;
import org.example.cryptowallet.mappers.StackingMapper;
import org.example.cryptowallet.models.Stacking;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Wallet;
import org.example.cryptowallet.models.Walletbalance;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.StackingService;
import org.example.cryptowallet.services.WalletService;
import org.example.cryptowallet.services.WalletbalanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/stacking")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class StackingController {
    private final StackingService stackingService;
    private final WalletbalanceService walletbalanceService;
    private final WalletService walletService;
    private final UserRepo userRepo;
    private final StackingMapper stackingMapper;

    @PostMapping("/{walletBalanceId}")
    public ResponseEntity<?> createStacking(@PathVariable Integer walletBalanceId,
                                            @RequestBody StackingDTO stackingDTO,
                                            Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));

            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(walletBalanceId);
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("zanyat");
            }

            Stacking stacking = stackingMapper.stackingDTOToStacking(stackingDTO);
            Stacking createdStacking = stackingService.createStacking(walletBalanceId, stacking);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(stackingMapper.stackingToStackingDTO(createdStacking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error pri sozdanii: " + e.getMessage());
        }
    }

    @GetMapping("/{walletBalanceId}")
    public ResponseEntity<?> getStacking(@PathVariable Integer walletBalanceId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("user not found"));

            Walletbalance walletBalance = walletbalanceService.getWalletbalanceById(walletBalanceId);
            Wallet wallet = walletService.getWalletById(walletBalance.getWallet().getId());
            if (!wallet.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Net dostupa");
            }

            Stacking stacking = stackingService.getStackingByWalletBalanceId(walletBalanceId);
            return ResponseEntity.ok(stackingMapper.stackingToStackingDTO(stacking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("error get wallet: " + e.getMessage());
        }
    }
}