package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.WalletbalanceDTO;
import org.example.cryptowallet.models.Walletbalance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WalletbalanceMapper {
    WalletbalanceMapper INSTANCE = Mappers.getMapper(WalletbalanceMapper.class);

    @Mapping(source = "wallet.id", target = "walletId")
    @Mapping(source = "currency.id", target = "currencyId")
    WalletbalanceDTO walletbalanceToWalletbalanceDTO(Walletbalance walletbalance);

    @Mapping(source = "walletId", target = "wallet.id")
    @Mapping(source = "currencyId", target = "currency.id")
    Walletbalance walletbalanceDTOToWalletbalance(WalletbalanceDTO walletbalanceDTO);

    List<WalletbalanceDTO> walletbalancesToWalletbalanceDTOs(List<Walletbalance> walletbalances);
}