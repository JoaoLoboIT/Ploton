package com.ploton.api.repository;

import com.ploton.api.model.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParcelaRepository extends JpaRepository<Parcela, Long> {

    // A query mais importante do módulo de faturas:
    // "Me dê todas as linhas (parcelas) que pertencem a esta fatura X"
    List<Parcela> findByFaturaId(Long faturaId);
}