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

    // Define a precisão monetária no banco de dados para evitar erros de arredondamento
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorAlvo;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal valorAtual;

    @Column(nullable = false)
    private LocalDate dataLimite;

    // Estabelece a relação de que muitas metas podem pertencer a um único usuário
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "prioridade") // Removido o nullable = false
    private Prioridade prioridade = Prioridade.MEDIO; // Valor padrão para registros novos e antigos

    @Column(name = "tipo_periodo") // Removido o nullable = false
    private String tipoPeriodo = "MENSAL"; // Valor padrão

    @Column(name = "eh_wishlist") // Removido o nullable = false
    private boolean ehWishlist = false;

    // Lógica de negócio: Calcula a porcentagem de conclusão baseada no valor atual vs alvo
    public BigDecimal getPorcentagemConcluida() {
        if (valorAlvo == null || valorAlvo.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        // Divide com precisão de 2 casas decimais e arredondamento padrão
        return valorAtual.divide(valorAlvo, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .setScale(2, java.math.RoundingMode.HALF_UP);
    }
}