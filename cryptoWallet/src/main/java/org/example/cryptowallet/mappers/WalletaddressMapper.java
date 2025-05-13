package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.WalletaddressDTO;
import org.example.cryptowallet.models.Walletaddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WalletaddressMapper {
    WalletaddressMapper INSTANCE = Mappers.getMapper(WalletaddressMapper.class);

    @Mapping(source = "wallet.id", target = "walletId")
    WalletaddressDTO walletaddressToWalletaddressDTO(Walletaddress walletaddress);

    @Mapping(source = "walletId", target = "wallet.id")
    Walletaddress walletaddressDTOToWalletaddress(WalletaddressDTO walletaddressDTO);

    List<WalletaddressDTO> walletaddressesToWalletaddressDTOs(List<Walletaddress> walletaddresses);
}