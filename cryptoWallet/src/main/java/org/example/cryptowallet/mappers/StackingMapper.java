package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.StackingDTO;
import org.example.cryptowallet.models.Stacking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StackingMapper {
    StackingMapper INSTANCE = Mappers.getMapper(StackingMapper.class);

    @Mapping(source = "walletBalance.id", target = "walletBalanceId")
    @Mapping(source = "profit", target = "profit")
    StackingDTO stackingToStackingDTO(Stacking stacking);

    @Mapping(source = "walletBalanceId", target = "walletBalance.id")
    @Mapping(source = "profit", target = "profit")
    Stacking stackingDTOToStacking(StackingDTO stackingDTO);

    List<StackingDTO> stackingsToStackingDTOs(List<Stacking> stackings);
}