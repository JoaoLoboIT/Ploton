package com.ploton.api.repository;

import com.ploton.api.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    // Busca personalizada usando a convenção de nomes do Spring Data JPA
    // Gera automaticamente um SQL que filtra por ID do usuário e ordena pela data
    List<Meta> findByUsuarioIdOrderByDataLimiteAsc(Long usuarioId);
}