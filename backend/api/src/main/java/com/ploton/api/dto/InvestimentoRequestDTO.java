package com.ploton.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record InvestimentoRequestDTO(
        @NotNull(message = "O ID do usuário é obrigatório")
        Long usuarioId,

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O tipo é obrigatório")
        String tipo, // renda_fixa, acoes, etc

        @NotNull(message = "O valor é obrigatório")
        @Positive(message = "O valor deve ser positivo")
        BigDecimal valorAplicado // No JSON chamamos de valorAplicado
) {}