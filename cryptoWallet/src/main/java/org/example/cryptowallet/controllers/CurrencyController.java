package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.DTO.CurrencyDTO;
import org.example.cryptowallet.mappers.CurrencyMapper;
import org.example.cryptowallet.models.Currency;
import org.example.cryptowallet.services.CurrencyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/currencies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class CurrencyController {
    private final CurrencyService currencyService;
    private final CurrencyMapper currencyMapper;

    @PostMapping
    public ResponseEntity<?> createCurrency(@RequestBody CurrencyDTO currencyDTO) {
        try {
            Currency currency = currencyMapper.currencyDTOToCurrency(currencyDTO);
            Currency createdCurrency = currencyService.createCurrency(currency);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(currencyMapper.currencyToCurrencyDTO(createdCurrency));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка с валютой: " + e.getMessage());
        }
    }

    @GetMapping("/{currencyId}")
    public ResponseEntity<?> getCurrency(@PathVariable Integer currencyId) {
        try {
            Currency currency = currencyService.getCurrencyById(currencyId);
            return ResponseEntity.ok(currencyMapper.currencyToCurrencyDTO(currency));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Господи ошибка с валютой: " + e.getMessage());
        }
    }
}