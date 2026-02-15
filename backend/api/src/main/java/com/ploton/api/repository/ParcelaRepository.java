package com.ploton.api.repository;

import com.ploton.api.model.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ParcelaRepository extends JpaRepository<Parcela, Long> {

    List<Parcela> findByFaturaId(Long faturaId);

    @Query("SELECT p FROM Parcela p JOIN p.fatura f JOIN f.cartao c WHERE c.usuario.id = :usuarioId AND f.mes = :mes AND f.ano = :ano")
    List<Parcela> findByUsuarioAndMesAndAno(@Param("usuarioId") Long usuarioId, @Param("mes") Integer mes, @Param("ano") Integer ano);
}