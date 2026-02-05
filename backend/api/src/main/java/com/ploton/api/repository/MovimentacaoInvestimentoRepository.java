package com.ploton.api.repository;

import com.ploton.api.model.MovimentacaoInvestimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoInvestimentoRepository extends JpaRepository<MovimentacaoInvestimento, Long> {

    // Lista o histórico de um investimento específico, do mais recente para o mais antigo
    List<MovimentacaoInvestimento> findByInvestimentoIdOrderByDataDesc(Long investimentoId);
}