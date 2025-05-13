package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userrole;
import org.example.cryptowallet.models.UserroleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserroleRepo extends JpaRepository<Userrole, UserroleId> {
    List<Userrole> findByUser(User user);
    @Query("SELECT ur FROM Userrole ur JOIN FETCH ur.role WHERE ur.user = :user")
    List<Userrole> findByUserWithRole(@Param("user") User user);
}
