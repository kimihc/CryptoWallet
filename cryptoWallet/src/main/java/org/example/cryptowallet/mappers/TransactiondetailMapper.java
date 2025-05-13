package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.TransactiondetailDTO;
import org.example.cryptowallet.models.Transactiondetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactiondetailMapper {
    TransactiondetailMapper INSTANCE = Mappers.getMapper(TransactiondetailMapper.class);

    @Mapping(source = "transaction.id", target = "transactionId")
    TransactiondetailDTO transactiondetailToTransactiondetailDTO(Transactiondetail transactiondetail);

    @Mapping(source = "transactionId", target = "transaction.id")
    Transactiondetail transactiondetailDTOToTransactiondetail(TransactiondetailDTO transactiondetailDTO);

    List<TransactiondetailDTO> transactiondetailsToTransactiondetailDTOs(List<Transactiondetail> transactiondetails);
}