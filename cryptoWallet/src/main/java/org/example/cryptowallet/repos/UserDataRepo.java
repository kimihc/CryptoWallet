package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userdatum;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserDataRepo extends JpaRepository<Userdatum, Integer> {
    Optional<Userdatum> findByUser(User user);
    Optional<Userdatum> findByEmail(String email);
}