package com.ploton.api.repository;

import com.ploton.api.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {

    // Busca todos os orçamentos de um usuário em um mês específico
    List<Orcamento> findByUsuarioIdAndMesAndAno(Long usuarioId, Integer mes, Integer ano);

    // Busca o orçamento de uma categoria específica
    Optional<Orcamento> findByUsuarioIdAndCategoriaAndMesAndAno(Long usuarioId, String categoria, Integer mes, Integer ano);
}