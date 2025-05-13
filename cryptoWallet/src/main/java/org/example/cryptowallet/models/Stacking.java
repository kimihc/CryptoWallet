package org.example.cryptowallet.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "stacking", schema = "cryptoWallet")
public class Stacking {
    @Id
    @Column(name = "walletBalance_id", nullable = false)
    private Integer id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "walletBalance_id", nullable = false)
    private Walletbalance walletBalance;

    @Column(name = "gett", nullable = false, precision = 18, scale = 8)
    private BigDecimal profit;

    @Column(name = "createAt", nullable = false)
    private Instant createAt;

    @Column(name = "expiryAt", nullable = false)
    private Instant expiryAt;
}