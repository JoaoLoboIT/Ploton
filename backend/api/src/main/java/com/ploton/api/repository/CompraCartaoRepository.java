package com.ploton.api.repository;

import com.ploton.api.model.CompraCartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraCartaoRepository extends JpaRepository<CompraCartao, Long> {

    // Busca o histórico de compras de um cartão específico
    // Útil para uma tela de "Extrato Geral" do cartão
    List<CompraCartao> findByCartaoIdOrderByDataCompraDesc(Long cartaoId);
}