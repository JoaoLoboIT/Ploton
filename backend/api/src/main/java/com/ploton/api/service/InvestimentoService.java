package com.ploton.api.service;

import com.ploton.api.dto.InvestimentoRequestDTO;
import com.ploton.api.dto.MovimentacaoRequestDTO;
import com.ploton.api.model.Investimento;
import com.ploton.api.model.MovimentacaoInvestimento;
import com.ploton.api.model.TipoMovimentacao;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.InvestimentoRepository;
import com.ploton.api.repository.MovimentacaoInvestimentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InvestimentoService {

    private final InvestimentoRepository investimentoRepository;
    private final MovimentacaoInvestimentoRepository movimentacaoRepository;
    private final UsuarioService usuarioService;

    public InvestimentoService(InvestimentoRepository investimentoRepository, MovimentacaoInvestimentoRepository movimentacaoRepository, UsuarioService usuarioService) {
        this.investimentoRepository = investimentoRepository;
        this.movimentacaoRepository = movimentacaoRepository;
        this.usuarioService = usuarioService;
    }

    public Investimento criar(InvestimentoRequestDTO dto) {
        Usuario dono = usuarioService.buscarPorId(dto.usuarioId());

        Investimento novoInvestimento = new Investimento();
        novoInvestimento.setNome(dto.nome());
        novoInvestimento.setTipo(dto.tipo());
        novoInvestimento.setUsuario(dono);
        // Saldo já nasce zero pela definição na classe Modelo

        return investimentoRepository.save(novoInvestimento);
    }

    public List<Investimento> listarPorUsuario(Long usuarioId) {
        return investimentoRepository.findByUsuarioIdOrderByNomeAsc(usuarioId);
    }

    @Transactional
    public MovimentacaoInvestimento registrarMovimentacao(MovimentacaoRequestDTO dto) {
        Investimento investimento = investimentoRepository.findById(dto.investimentoId())
                .orElseThrow(() -> new RuntimeException("Investimento não encontrado"));

        MovimentacaoInvestimento mov = new MovimentacaoInvestimento();
        mov.setInvestimento(investimento);
        mov.setValor(dto.valor());
        mov.setTipo(dto.tipo());
        if (dto.data() != null) {
            mov.setData(dto.data());
        }

        MovimentacaoInvestimento movSalva = movimentacaoRepository.save(mov);

        atualizarSaldo(investimento, dto.valor(), dto.tipo());
        investimentoRepository.save(investimento);

        return movSalva;
    }

    private void atualizarSaldo(Investimento investimento, BigDecimal valor, TipoMovimentacao tipo) {
        if (tipo == TipoMovimentacao.RESGATE) {
            // Se for saque, subtrai
            investimento.setSaldo(investimento.getSaldo().subtract(valor));
        } else {
            // Se for Aporte ou Rendimento, soma
            investimento.setSaldo(investimento.getSaldo().add(valor));
        }
    }
}