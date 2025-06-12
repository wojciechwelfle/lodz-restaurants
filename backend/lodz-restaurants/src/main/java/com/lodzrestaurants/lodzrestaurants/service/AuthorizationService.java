package com.lodzrestaurants.lodzrestaurants.service;

import com.lodzrestaurants.lodzrestaurants.configuration.security.JwtService;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User.UserRole;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.LoginDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.dto.UserDto;
import com.lodzrestaurants.lodzrestaurants.dataaccess.repository.UserRepository;
import com.lodzrestaurants.lodzrestaurants.exceptions.BadRequest;
import com.lodzrestaurants.lodzrestaurants.exceptions.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public AuthorizationService(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public LoginDto login(UserDto userDto) {
        User user = authenticateUser(userDto);

        String username = user.getUsername();
        UserRole role = user.getRole();
        String token = jwtService.generateToken(username, role);

        return new LoginDto(username, token, role);
    }

    public void register(UserDto userDto) {
        if (userDto == null || userDto.username() == null || userDto.password() == null) {
            throw new BadRequest("Invalid registration request: username and password must not be null");
        }

        if (userRepository.existsById(userDto.username())) {
            throw new BadRequest("Username already exists");
        }

        User user = new User(userDto.username(), userDto.password());
        
        userRepository.save(user);
    }

    private User authenticateUser(UserDto userDto) {
        if (userDto == null || userDto.username() == null || userDto.password() == null) {
            throw new BadRequest("Invalid login request: username and password must not be null");
        }

        User user = userRepository.findById(userDto.username())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!user.getPassword().equals(userDto.password())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        return user;
    }
}
