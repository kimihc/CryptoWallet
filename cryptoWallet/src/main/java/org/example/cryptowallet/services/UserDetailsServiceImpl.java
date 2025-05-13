package org.example.cryptowallet.services;

import org.example.cryptowallet.models.Role;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userrole;
import org.example.cryptowallet.repos.UserRepo;
import org.example.cryptowallet.repos.UserroleRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepo userRepo;
    private final UserroleRepo userroleRepo;

    public UserDetailsServiceImpl(UserRepo userRepo, UserroleRepo userroleRepo) {
        this.userRepo = userRepo;
        this.userroleRepo = userroleRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepo.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

//        List<Role> roles = userroleRepo.findByUser(user).stream()
//                .map(Userrole::getRole)
//                .collect(Collectors.toList());

        List<Role> roles = userroleRepo.findByUserWithRole(user).stream()
                .map(Userrole::getRole)
                .collect(Collectors.toList());

        return new UserDetailsImpl(user, roles);
    }
}
