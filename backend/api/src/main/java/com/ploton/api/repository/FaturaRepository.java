package com.ploton.api.repository;

import com.ploton.api.model.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

@Repository
public interface FaturaRepository extends JpaRepository<Fatura, Long> {

    Optional<Fatura> findByCartaoIdAndMesAndAno(Long cartaoId, Integer mes, Integer ano);
    List<Fatura> findByCartaoId(Long cartaoId);
    @Query("SELECT COALESCE(SUM(f.valorTotal), 0) FROM Fatura f WHERE f.cartao.usuario.id = :usuarioId AND f.mes = :mes AND f.ano = :ano")
    BigDecimal calcularTotalFaturasDoMes(@Param("usuarioId") Long usuarioId, @Param("mes") Integer mes, @Param("ano") Integer ano);
}