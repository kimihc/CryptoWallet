package org.example.cryptowallet.services;

import org.example.cryptowallet.models.*;
import org.example.cryptowallet.repos.RoleRepo;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.repos.UserroleRepo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RoleRepo roleRepo;
    private final UserroleRepo userroleRepo;

    public UserService(UserRepo userRepo,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                         RoleRepo roleRepo,
                       UserroleRepo userroleRepo) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.roleRepo = roleRepo;
        this.userroleRepo = userroleRepo;
    }

    public User verify(User input) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input.getLogin(), input.getPassword())
        );

        if (auth.isAuthenticated()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
            String login = userDetails.getUsername();
            return userRepo.findByLogin(login)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));
        } else {
            throw new NoSuchElementException("Invalid credentials");
        }
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepo.save(user);

        Role defaultRole = roleRepo.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        Userrole userrole = new Userrole();
        userrole.setUser(savedUser);
        userrole.setRole(defaultRole);

        UserroleId id = new UserroleId();
        id.setUserId(savedUser.getId());
        id.setRoleId(defaultRole.getId());

        userrole.setId(id);

        userroleRepo.save(userrole);

        return savedUser;
    }
}
