package com.ploton.api.repository;

import com.ploton.api.model.HistoricoInvestimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoricoInvestimentoRepository extends JpaRepository<HistoricoInvestimento, Long> {
    List<HistoricoInvestimento> findByInvestimentoIdOrderByDataRegistroAsc(Long investimentoId);
}