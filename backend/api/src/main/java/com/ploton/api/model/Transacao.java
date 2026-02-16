package com.ploton.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "transacoes")
@Data
public class Transacao {
    @Column(name = "name")
    private String nome;

    @Column(name = "instalamento_id")
    private String instalamentoId;

    @Column(name = "parcela_atual")
    private Integer parcelaAtual = 1;

    @Column(name = "total_parcelas")
    private Integer totalParcelas = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate data;

    private String categoria;

    // Persiste o nome da constante ("RECEITA", "DESPESA") no banco
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTransacao tipo;

    @Column(name = "metodo_pagamento")
    private String metodoPagamento;

    // Define relacionamento e chave estrangeira (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;
}