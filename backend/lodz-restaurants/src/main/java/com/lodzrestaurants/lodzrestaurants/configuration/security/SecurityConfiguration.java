package com.lodzrestaurants.lodzrestaurants.configuration.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    private final JwtFilter jwtFilter;

    public SecurityConfiguration(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    private static final List<EndpointAccess> WHITELIST = List.of(
            new EndpointAccess(HttpMethod.DELETE, "**"),
            new EndpointAccess(HttpMethod.POST, "/api/v1/authorization/login"),
            new EndpointAccess(HttpMethod.GET, "/api/v1/restaurants"),
            new EndpointAccess(HttpMethod.GET, "/api/v1/menu"),
            new EndpointAccess(HttpMethod.GET, "/api/v1/menu/*"),
            new EndpointAccess(HttpMethod.GET, "/v3/api-docs/**"),
            new EndpointAccess(HttpMethod.GET, "/api/api-docs/**"),
            new EndpointAccess(HttpMethod.GET, "/swagger-ui/**")
    );

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> {
                    WHITELIST.forEach(entry ->
                            auth.requestMatchers(entry.method(), entry.path()).permitAll()
                    );
                    auth.anyRequest().authenticated();
                })
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
                        })
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private record EndpointAccess(HttpMethod method, String path) {
    }
}
