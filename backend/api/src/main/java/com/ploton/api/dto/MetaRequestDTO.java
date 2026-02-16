package com.ploton.api.dto;

import com.ploton.api.model.Prioridade;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record MetaRequestDTO(
        @NotNull(message = "O ID do usuário é obrigatório")
        Long usuarioId,

        @NotBlank(message = "O nome da meta é obrigatório")
        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
        String descricao,

        @NotNull(message = "O valor alvo é obrigatório")
        @Positive(message = "O valor alvo deve ser maior que zero")
        BigDecimal valorAlvo,

        @PositiveOrZero(message = "O valor inicial não pode ser negativo")
        BigDecimal valorAtual,

        @NotNull(message = "A data limite é obrigatória")
        @Future(message = "A data limite deve ser no futuro")
        LocalDate dataLimite,

        // NOVOS CAMPOS PARA A VERSÃO 2.0
        @NotNull(message = "A prioridade é obrigatória")
        Prioridade prioridade,

        @NotBlank(message = "O tipo de período é obrigatório")
        String tipoPeriodo, // "SEMANAL", "MENSAL" ou "ANUAL"

        boolean ehWishlist
) {}