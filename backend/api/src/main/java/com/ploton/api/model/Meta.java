package com.ploton.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "metas")
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String descricao;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorAlvo;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorAtual;

    @Column(nullable = false)
    private LocalDate dataLimite;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    public BigDecimal getPorcentagemConcluida() {
        if (valorAlvo == null || valorAlvo.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return valorAtual.divide(valorAlvo, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }
}