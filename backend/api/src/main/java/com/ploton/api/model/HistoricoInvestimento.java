package com.ploton.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "historico_investimentos")
public class HistoricoInvestimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_registro", nullable = false)
    private LocalDate dataRegistro;

    @Column(name = "saldo_total_dia", nullable = false)
    private BigDecimal saldoTotalDoDia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investimento_id", nullable = false)
    @JsonIgnore
    private Investimento investimento;

    public HistoricoInvestimento() {}

    public HistoricoInvestimento(LocalDate dataRegistro, BigDecimal saldoTotalDoDia, Investimento investimento) {
        this.dataRegistro = dataRegistro;
        this.saldoTotalDoDia = saldoTotalDoDia;
        this.investimento = investimento;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDataRegistro() { return dataRegistro; }
    public void setDataRegistro(LocalDate dataRegistro) { this.dataRegistro = dataRegistro; }

    public BigDecimal getSaldoTotalDoDia() { return saldoTotalDoDia; }
    public void setSaldoTotalDoDia(BigDecimal saldoTotalDoDia) { this.saldoTotalDoDia = saldoTotalDoDia; }

    public Investimento getInvestimento() { return investimento; }
    public void setInvestimento(Investimento investimento) { this.investimento = investimento; }
}