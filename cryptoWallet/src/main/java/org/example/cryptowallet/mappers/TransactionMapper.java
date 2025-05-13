package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.TransactionDTO;
import org.example.cryptowallet.models.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionMapper INSTANCE = Mappers.getMapper(TransactionMapper.class);

    @Mapping(source = "walletBalance.id", target = "walletBalanceId")
    TransactionDTO transactionToTransactionDTO(Transaction transaction);

    @Mapping(source = "walletBalanceId", target = "walletBalance.id")
    Transaction transactionDTOToTransaction(TransactionDTO transactionDTO);

    List<TransactionDTO> transactionsToTransactionDTOs(List<Transaction> transactions);
}