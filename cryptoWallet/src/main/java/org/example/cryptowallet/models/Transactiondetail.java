package org.example.cryptowallet.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "transactiondetail", schema = "cryptoWallet")
public class Transactiondetail {
    @Id
    @Column(name = "transaction_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "fromAddress")
    private String fromAddress;

    @Column(name = "toAddress")
    private String toAddress;

    @Column(name = "fee", precision = 18, scale = 8)
    private BigDecimal fee;

    @Column(name = "status", length = 20)
    private String status;

}