package com.ploton.api.repository;

import com.ploton.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Metodo customizado para buscar usuário por email (login)
    Optional<Usuario> findByEmail(String email);

}