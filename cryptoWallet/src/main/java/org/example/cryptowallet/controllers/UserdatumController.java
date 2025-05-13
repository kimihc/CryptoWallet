package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userdatum;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.services.EmailService;
import org.example.cryptowallet.services.UserDatumService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/userdata")
@RequiredArgsConstructor
public class UserdatumController {

    private final UserDatumService userdatumService;
    private final UserRepo userRepo;
    private final EmailService emailService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> createUserdatum(@PathVariable Integer userId,
                                             @RequestBody Userdatum userdatum) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userdatumService.createUserdatum(userId, userdatum));
    }

    @PostMapping("/{userId}/accept")
    public ResponseEntity<?> acceptOrder(@PathVariable Long userId, Principal principal) {
        try {
            String login = principal.getName();
            User user = userRepo.findByLogin(login)
                    .orElseThrow(() -> new Exception("User not found"));

            emailService.sendAssignmentEmail(user.getLogin(), "Человечек с" + userId);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error accepting order");
        }
    }


}
