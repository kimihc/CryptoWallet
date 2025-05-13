package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByLogin(String login);
    Optional<User> getUserByLogin(String login);
}
