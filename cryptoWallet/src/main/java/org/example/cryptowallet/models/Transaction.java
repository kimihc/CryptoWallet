package org.example.cryptowallet.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "transaction", schema = "cryptoWallet")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "walletBalance_id", nullable = false)
    private Walletbalance walletBalance;

    @Column(name = "transactionType", nullable = false, length = 20)
    private String transactionType;

    @Column(name = "createAt", nullable = false)
    private Instant createAt;
}