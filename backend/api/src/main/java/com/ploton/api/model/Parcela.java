package com.ploton.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "parcelas")
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_parcela", nullable = false)
    private Integer numeroParcela; // Ex: 1, 2, 3...

    @Column(nullable = false)
    private BigDecimal valor;

    // Relacionamento com a Compra Original (Mãe)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compra_id", nullable = false)
    @JsonIgnore
    private CompraCartao compra;

    // Relacionamento com a Fatura (Gaveta)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fatura_id", nullable = false)
    @JsonIgnore
    private Fatura fatura;

    public Parcela() {}

    // Construtor auxiliar para facilitar a criação no Service
    public Parcela(Integer numeroParcela, BigDecimal valor, CompraCartao compra, Fatura fatura) {
        this.numeroParcela = numeroParcela;
        this.valor = valor;
        this.compra = compra;
        this.fatura = fatura;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getNumeroParcela() { return numeroParcela; }
    public void setNumeroParcela(Integer numeroParcela) { this.numeroParcela = numeroParcela; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public CompraCartao getCompra() { return compra; }
    public void setCompra(CompraCartao compra) { this.compra = compra; }

    public Fatura getFatura() { return fatura; }
    public void setFatura(Fatura fatura) { this.fatura = fatura; }
}