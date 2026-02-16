package com.ploton.api.repository;

import com.ploton.api.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByUsuarioIdOrderByDataDesc(Long usuarioId);

    // Busca todas as transações de um usuário específico
    List<Transacao> findByUsuarioId(Long usuarioId);

    // Busca transações de um usuário dentro de um intervalo de datas (para filtros de mês/ano)
    List<Transacao> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);

    // Soma todas as RECEITAS de um usuário
    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t WHERE t.usuario.id = :usuarioId AND t.tipo = 'RECEITA'")
    BigDecimal calcularTotalReceitas(@Param("usuarioId") Long usuarioId);

    // Soma todas as DESPESAS de um usuário
    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t WHERE t.usuario.id = :usuarioId AND t.tipo = 'DESPESA'")
    BigDecimal calcularTotalDespesas(@Param("usuarioId") Long usuarioId);

    @Query(value = """
    SELECT 
        to_char(t.data, 'MM/YYYY') as mes,
        SUM(CASE WHEN t.metodo_pagamento IN ('DEBITO', 'PIX') THEN t.valor ELSE 0 END) as valorAVista,
        SUM(CASE WHEN t.metodo_pagamento = 'CREDITO' THEN t.valor ELSE 0 END) as valorCredito
    FROM transacoes t
    WHERE t.usuario_id = :usuarioId 
      AND t.tipo = 'DESPESA'
      -- Alterado para pegar 3 meses passados e 4 meses futuros
      AND t.data BETWEEN CURRENT_DATE - INTERVAL '3 months' AND CURRENT_DATE + INTERVAL '4 months'
    GROUP BY to_char(t.data, 'MM/YYYY'), date_trunc('month', t.data)
    ORDER BY date_trunc('month', t.data) ASC
    """, nativeQuery = true)
    List<Object[]> buscarResumoUltimosSeisMeses(@Param("usuarioId") Long usuarioId);

    @Query(value = """
        SELECT 
            to_char(t.data, 'MM/YYYY') as mes,
            SUM(CASE WHEN t.metodo_pagamento IN ('DEBITO', 'PIX') THEN t.valor ELSE 0 END) as valorAVista,
            SUM(CASE WHEN t.metodo_pagamento = 'CREDITO' THEN t.valor ELSE 0 END) as valorCredito
        FROM transacoes t
        WHERE t.usuario_id = :usuarioId 
          AND t.tipo = 'DESPESA'
          AND t.data BETWEEN CURRENT_DATE - INTERVAL '3 months' AND CURRENT_DATE + INTERVAL '6 months'
        GROUP BY to_char(t.data, 'MM/YYYY'), date_trunc('month', t.data)
        ORDER BY date_trunc('month', t.data) ASC
        """, nativeQuery = true)
    List<Object[]> buscarResumoHibrido(@Param("usuarioId") Long usuarioId);

    void deleteByInstalamentoId(String instalamentoId);

    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t " +
            "WHERE t.usuario.id = :usuarioId AND t.tipo = 'DESPESA' " +
            "AND t.data BETWEEN :inicio AND :fim")
    BigDecimal calcularDespesasNoPeriodo(@Param("usuarioId") Long usuarioId,
                                         @Param("inicio") LocalDate inicio,
                                         @Param("fim") LocalDate fim);

    @Query("SELECT COALESCE(SUM(t.valor), 0) FROM Transacao t " +
            "WHERE t.usuario.id = :usuarioId AND t.tipo = 'RECEITA' " +
            "AND t.data BETWEEN :inicio AND :fim")
    BigDecimal calcularReceitasNoPeriodo(@Param("usuarioId") Long usuarioId,
                                         @Param("inicio") LocalDate inicio,
                                         @Param("fim") LocalDate fim);
}