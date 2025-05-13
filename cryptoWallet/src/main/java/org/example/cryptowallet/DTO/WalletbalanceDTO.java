package org.example.cryptowallet.DTO;

import java.math.BigDecimal;

public record WalletbalanceDTO(Integer id, Integer walletId, Integer currencyId, BigDecimal balance, BigDecimal amount) {
}