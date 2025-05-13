package org.example.cryptowallet.repos;

import org.example.cryptowallet.models.Userdatum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserdatumRepo extends JpaRepository<Userdatum, Integer> {
    
}
