package com.ploton.api.controller;

import com.ploton.api.dto.MetaRequestDTO;
import com.ploton.api.model.Meta;
import com.ploton.api.service.MetaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/metas")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    @PostMapping
    public ResponseEntity<Meta> criar(@RequestBody @Valid MetaRequestDTO dto) {
        Meta metaSalva = metaService.criar(dto);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(metaSalva.getId())
                .toUri();

        return ResponseEntity.created(uri).body(metaSalva);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Meta>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Meta> metas = metaService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(metas);
    }
}