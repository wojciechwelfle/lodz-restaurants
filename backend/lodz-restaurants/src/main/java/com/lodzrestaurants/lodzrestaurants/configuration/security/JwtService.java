package com.lodzrestaurants.lodzrestaurants.configuration.security;

import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Value("${jwt.token-expiration}")
    private long JWT_TOKEN_EXPIRATION;
    
    private static final String ROLE_CLAIM = "role";

    public String generateToken(String username) {
        return generateToken(username, UserRole.USER);
    }
    
    public String generateToken(String username, UserRole role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(ROLE_CLAIM, role.name());
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }
    
    public UserRole extractRole(String token) {
        String roleName = extractAllClaims(token).get(ROLE_CLAIM, String.class);
        return roleName != null ? UserRole.valueOf(roleName) : UserRole.USER;
    }

    public boolean isTokenValid(String token) {
        try {
            return extractUsername(token) != null && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET));
    }
}
