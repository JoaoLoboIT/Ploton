package com.ploton.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "investimentos")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private BigDecimal saldo = BigDecimal.ZERO;

    @Column(name = "valor_investido")
    private BigDecimal valorInvestido = BigDecimal.ZERO;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @OneToMany(mappedBy = "investimento", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MovimentacaoInvestimento> movimentacoes = new ArrayList<>();

    public Investimento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public BigDecimal getSaldo() { return saldo; }
    public void setSaldo(BigDecimal saldo) { this.saldo = saldo; }

    public BigDecimal getValorInvestido() { return valorInvestido; }
    public void setValorInvestido(BigDecimal valorInvestido) { this.valorInvestido = valorInvestido; }

    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public List<MovimentacaoInvestimento> getMovimentacoes() { return movimentacoes; }
    public void setMovimentacoes(List<MovimentacaoInvestimento> movimentacoes) { this.movimentacoes = movimentacoes; }
}