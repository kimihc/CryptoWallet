package org.example.cryptowallet.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "currency", schema = "cryptoWallet")
public class Currency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "currencyName", nullable = false, length = 50)
    private String currencyName;

    @Column(name = "cymbol", nullable = false, length = 5)
    private String cymbol;

    public void setSymbol(String cymbol) {
        this.cymbol = cymbol;
    }
}