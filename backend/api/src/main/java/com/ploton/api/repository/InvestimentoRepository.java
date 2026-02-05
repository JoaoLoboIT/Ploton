package com.ploton.api.repository;

import com.ploton.api.model.Investimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {

    // Busca a carteira de investimentos do usuário
    // Ordenar por nome facilita a visualização na lista
    List<Investimento> findByUsuarioIdOrderByNomeAsc(Long usuarioId);
}