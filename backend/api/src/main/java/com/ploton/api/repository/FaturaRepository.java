package com.ploton.api.repository;

import com.ploton.api.model.Fatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FaturaRepository extends JpaRepository<Fatura, Long> {

    // Busca uma fatura específica de um cartão por mês e ano
    // O Optional é usado porque a fatura pode ainda não ter sido criada
    Optional<Fatura> findByCartaoIdAndMesAndAno(Long cartaoId, Integer mes, Integer ano);

    // Lista todas as faturas de um cartão para gerar gráficos de histórico
    List<Fatura> findByCartaoId(Long cartaoId);
}