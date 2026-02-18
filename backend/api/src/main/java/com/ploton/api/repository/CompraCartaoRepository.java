package com.ploton.api.repository;

import com.ploton.api.model.CompraCartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraCartaoRepository extends JpaRepository<CompraCartao, Long> {
    List<CompraCartao> findByCartaoIdOrderByDataCompraDesc(Long cartaoId);
}