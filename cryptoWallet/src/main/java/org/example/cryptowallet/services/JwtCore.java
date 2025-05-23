package org.example.cryptowallet.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.example.cryptowallet.models.User;
import org.example.cryptowallet.models.Userrole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Component
public class JwtCore {
    private final SecretKey secretKey;
    @Value("${crypto_wallet.app.lifetime}")
    private int expirationDate;

    public JwtCore(@Value("${jwt.secret}") String secret) {
        byte[] decodedKey = hexStringToByteArray(secret);
        this.secretKey = new SecretKeySpec(decodedKey, "HmacSHA256");
    }
    private byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }
    public String generateToken(User user, List<String> roles) {
        return Jwts.builder()
                .setSubject(user.getLogin())
                .claim("roles", roles)
                .claim("authorities", roles.stream().map(r -> "ROLE_" + r).toList())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis()+expirationDate))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build().parseClaimsJws(token).getBody();
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    private boolean isTokenExpired(String token) {
        return extractExpirationDate(token).before(new Date());
    }

    private Date extractExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    private Key getSigningKey() {
        return secretKey;
    }
}
