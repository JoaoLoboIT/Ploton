package com.ploton.api.controller;

import com.ploton.api.dto.InvestimentoRequestDTO;
import com.ploton.api.dto.MovimentacaoRequestDTO;
import com.ploton.api.model.Investimento;
import com.ploton.api.model.MovimentacaoInvestimento;
import com.ploton.api.service.InvestimentoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/investimentos")
@CrossOrigin(origins = "*")
public class InvestimentoController {

    private final InvestimentoService service;

    public InvestimentoController(InvestimentoService service) {
        this.service = service;
    }

    // 1. Cria um novo ativo na carteira
    @PostMapping
    public ResponseEntity<Investimento> criar(@RequestBody InvestimentoRequestDTO dto) {
        Investimento novo = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novo);
    }

    // 2. Lista todos os investimentos do usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Investimento>> listar(@PathVariable Long usuarioId) {
        List<Investimento> lista = service.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(lista);
    }

    // 3. A "Torneira": Realiza Aporte, Resgate ou Rendimento
    @PostMapping("/movimentacao")
    public ResponseEntity<MovimentacaoInvestimento> movimentar(@RequestBody MovimentacaoRequestDTO dto) {
        MovimentacaoInvestimento mov = service.registrarMovimentacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mov);

    }

    @PatchMapping("/{id}/aporte")
    public ResponseEntity<Investimento> fazerAporte(
            @PathVariable Long id,
            @RequestBody com.ploton.api.dto.OperacaoInvestimentoDTO dto) {
        return ResponseEntity.ok(service.fazerAporte(id, dto.valor()));
    }

    @PatchMapping("/{id}/rendimento")
    public ResponseEntity<Investimento> atualizarRendimento(
            @PathVariable Long id,
            @RequestBody com.ploton.api.dto.OperacaoInvestimentoDTO dto) {
        return ResponseEntity.ok(service.atualizarValorMercado(id, dto.valor()));
    }
}