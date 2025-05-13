package org.example.cryptowallet.DTO;

import java.math.BigDecimal;
import java.time.Instant;

public record StackingDTO(Integer id, Integer walletBalanceId, BigDecimal profit, Instant createAt, Instant expiryAt) {
}