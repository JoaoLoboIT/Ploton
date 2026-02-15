package com.ploton.api.repository;

import com.ploton.api.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByUsuarioIdOrderByDataLimiteAsc(Long usuarioId);

    @Query("SELECT COALESCE(SUM(m.valorAtual), 0) FROM Meta m WHERE m.usuario.id = :usuarioId")
    BigDecimal calcularTotalGuardado(@Param("usuarioId") Long usuarioId);
}