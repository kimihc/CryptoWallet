package org.example.cryptowallet.DTO;

import java.math.BigDecimal;

public record TransactiondetailDTO(Integer transactionId, String fromAddress, String toAddress, BigDecimal fee, String status) {
}