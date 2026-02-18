package com.ploton.api.repository;

import com.ploton.api.model.CartaoCredito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoCreditoRepository extends JpaRepository<CartaoCredito, Long> {
    List<CartaoCredito> findByUsuarioId(Long usuarioId);
}