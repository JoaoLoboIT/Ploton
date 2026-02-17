package com.ploton.api.service;

import com.ploton.api.dto.CartaoCreditoRequestDTO;
import com.ploton.api.model.CartaoCredito;
import com.ploton.api.model.Usuario;
import com.ploton.api.repository.CartaoCreditoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartaoCreditoService {

    private final CartaoCreditoRepository repository;
    private final UsuarioService usuarioService;

    public CartaoCreditoService(CartaoCreditoRepository repository, UsuarioService usuarioService) {
        this.repository = repository;
        this.usuarioService = usuarioService;
    }

    @Transactional
    public CartaoCredito cadastrar(CartaoCreditoRequestDTO dados) {
        // Busca o dono do cartão. Se não achar, lança erro e para tudo.
        Usuario dono = usuarioService.buscarPorId(dados.usuarioId());

        CartaoCredito novoCartao = new CartaoCredito();
        novoCartao.setNome(dados.nome());
        novoCartao.setDiaFechamento(dados.diaFechamento());
        novoCartao.setDiaVencimento(dados.diaVencimento());
        novoCartao.setLimiteTotal(dados.limiteTotal());
        novoCartao.setUsuario(dono);

        return repository.save(novoCartao);
    }

    public List<CartaoCredito> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    // Adicione isso no CartaoCreditoService
    public CartaoCredito buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cartão não encontrado"));
    }

    @Transactional
    public void deletar(Long id) {
        CartaoCredito cartao = buscarPorId(id);
        repository.delete(cartao);
    }
}