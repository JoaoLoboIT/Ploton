package com.ploton.api.dto;

public record InvestimentoRequestDTO(
        String nome,
        String tipo,
        Long usuarioId
) {}