package org.example.cryptowallet.DTO;

import java.time.Instant;

public record TransactionDTO(Integer id, Integer walletBalanceId, String transactionType, Instant createAt) {
}