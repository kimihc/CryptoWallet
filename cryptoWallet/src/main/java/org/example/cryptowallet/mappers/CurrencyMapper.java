package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.CurrencyDTO;
import org.example.cryptowallet.models.Currency;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CurrencyMapper {
    CurrencyMapper INSTANCE = Mappers.getMapper(CurrencyMapper.class);

    @Mapping(source = "cymbol", target = "symbol")
    CurrencyDTO currencyToCurrencyDTO(Currency currency);

    @Mapping(source = "symbol", target = "cymbol")
    Currency currencyDTOToCurrency(CurrencyDTO currencyDTO);

    List<CurrencyDTO> currenciesToCurrencyDTOs(List<Currency> currencies);
}