package com.ploton.api.repository;

import com.ploton.api.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {
    List<Investimento> findByUsuarioId(Long usuarioId);

    // Metodo usado pelo seu InvestimentoService (Listar por nome)
    List<Investimento> findByUsuarioIdOrderByNomeAsc(Long usuarioId);

    // Metodo usado pelo DashboardService (Somar saldo total)
    @Query("SELECT COALESCE(SUM(i.saldo), 0) FROM Investimento i WHERE i.usuario.id = :usuarioId")
    BigDecimal calcularTotalAplicado(@Param("usuarioId") Long usuarioId);
}