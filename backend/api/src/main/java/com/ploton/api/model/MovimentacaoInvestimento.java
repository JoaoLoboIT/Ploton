package com.ploton.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimentacoes_investimento")
public class MovimentacaoInvestimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacao tipo;

    @Column(nullable = false)
    private LocalDate data = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "investimento_id", nullable = false)
    @JsonIgnore
    private Investimento investimento;

    public MovimentacaoInvestimento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public TipoMovimentacao getTipo() { return tipo; }
    public void setTipo(TipoMovimentacao tipo) { this.tipo = tipo; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public Investimento getInvestimento() { return investimento; }
    public void setInvestimento(Investimento investimento) { this.investimento = investimento; }
}