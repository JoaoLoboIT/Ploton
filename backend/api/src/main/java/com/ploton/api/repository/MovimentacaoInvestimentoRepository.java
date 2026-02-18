package com.ploton.api.repository;

import com.ploton.api.model.MovimentacaoInvestimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoInvestimentoRepository extends JpaRepository<MovimentacaoInvestimento, Long> {
    List<MovimentacaoInvestimento> findByInvestimentoIdOrderByDataDesc(Long investimentoId);
}