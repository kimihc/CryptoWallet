//package org.example.cryptowallet.services;
//
//import jakarta.persistence.EntityNotFoundException;
//import lombok.RequiredArgsConstructor;
//import org.example.cryptowallet.DTO.UserDataDTO;
//import org.example.cryptowallet.models.User;
//import org.example.cryptowallet.models.Userdatum;
//import org.example.cryptowallet.repos.UserRepo;
//import org.example.cryptowallet.repos.UserdatumRepo;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class UserDatumService {
//    private final UserRepo userRepo;
//    private final UserdatumRepo userdatumRepo;
//
//    public void saveUserdatum(String login, UserDataDTO dto) {
//        User user = userRepo.findByLogin(login)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        if (userdatumRepo.existsById(Math.toIntExact(Long.valueOf(user.getId())))) {
//            throw new RuntimeException("Userdatum already exists");
//        }
//
//        Userdatum userdatum = new Userdatum();
//        userdatum.setUser(user);
//        userdatum.setId(user.getId());
//        userdatum.setFirstName(dto.firstName());
//        userdatum.setLastName(dto.lastName());
//        userdatum.setPhone(dto.phone());
//        userdatum.setEmail(dto.email());
//
//        userdatumRepo.save(userdatum);
//    }
//
//    @Transactional
//    public Userdatum updateUserDatum(Integer id, Userdatum userDatum) {
//        Userdatum existingUserDatum = userdatumRepo.findById(Math.toIntExact(Long.valueOf(id)))
//                .orElseThrow(() -> new EntityNotFoundException("Userdatum not found"));
//
//        existingUserDatum.setFirstName(userDatum.getFirstName());
//        existingUserDatum.setLastName(userDatum.getLastName());
//        existingUserDatum.setPhone(userDatum.getPhone());
//        existingUserDatum.setEmail(userDatum.getEmail());
//        return userdatumRepo.save(existingUserDatum);
//    }
//}
//

package org.example.cryptowallet.services;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userdatum;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.repos.UserdatumRepo;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserDatumService {

    private final UserdatumRepo userdatumRepo;
    private final UserRepo userRepo;

    public Userdatum createUserdatum(Integer userId, Userdatum userdatum) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        userdatum.setUser(user);
        userdatum.setId(user.getId());

        return userdatumRepo.save(userdatum);
    }
}
