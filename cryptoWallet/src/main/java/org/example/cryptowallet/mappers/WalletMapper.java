package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.WalletDTO;
import org.example.cryptowallet.models.Wallet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WalletMapper {
    WalletMapper INSTANCE = Mappers.getMapper(WalletMapper.class);

    @Mapping(source = "user.id", target = "userId")
    WalletDTO walletToWalletDTO(Wallet wallet);

    @Mapping(source = "userId", target = "user.id")
    Wallet walletDTOToWallet(WalletDTO walletDTO);

    List<WalletDTO> walletsToWalletDTOs(List<Wallet> wallets);
}