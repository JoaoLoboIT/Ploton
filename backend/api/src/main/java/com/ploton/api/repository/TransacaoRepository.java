package com.ploton.api.repository;

import com.ploton.api.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Busca todas as transações de um usuário específico
    List<Transacao> findByUsuarioId(Long usuarioId);

    // Busca transações de um usuário dentro de um intervalo de datas (para filtros de mês/ano)
    List<Transacao> findByUsuarioIdAndDataBetween(Long usuarioId, LocalDate inicio, LocalDate fim);
}