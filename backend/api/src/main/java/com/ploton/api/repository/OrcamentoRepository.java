package com.ploton.api.repository;

import com.ploton.api.model.Orcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrcamentoRepository extends JpaRepository<Orcamento, Long> {
    List<Orcamento> findByUsuarioIdAndMesAndAno(Long usuarioId, Integer mes, Integer ano);
    Optional<Orcamento> findByUsuarioIdAndCategoriaAndMesAndAno(Long usuarioId, String categoria, Integer mes, Integer ano);
}