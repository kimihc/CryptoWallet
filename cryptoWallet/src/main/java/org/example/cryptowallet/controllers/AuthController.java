package org.example.cryptowallet.controllers;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.Role;
import org.example.cryptowallet.mappers.UserMapper;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.repos.UserroleRepo;
import org.example.cryptowallet.services.JwtCore;
import org.example.cryptowallet.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtCore jwtCore;
    private final UserroleRepo userroleRepo;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody User input) {
        User registeredUser = userService.registerUser(input);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userMapper.userToUserDTO(registeredUser));
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@RequestBody User input) {
        User verifiedUser = userService.verify(input);

        List<String> roles = verifiedUser.getUserroles()
                .stream()
                .map(userrole -> userrole.getRole().getRoleName())
                .toList();

        String jwtToken = jwtCore.generateToken(verifiedUser, roles);

        return ResponseEntity.ok(Map.of("token", jwtToken));
    }
}