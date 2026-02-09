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
}