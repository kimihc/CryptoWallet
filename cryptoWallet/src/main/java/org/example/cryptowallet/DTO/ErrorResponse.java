package org.example.cryptowallet.DTO;

public record ErrorResponse(String errorCode, String message, long timestamp) {
}