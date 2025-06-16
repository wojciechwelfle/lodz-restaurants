package com.lodzrestaurants.lodzrestaurants.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class CorsConfiguration {

     @Bean
     public WebMvcConfigurer corsConfigurer() {
         return new WebMvcConfigurer() {
             @Override
             public void addCorsMappings(@NonNull CorsRegistry registry) {
                 registry.addMapping("/**")
                         .allowedOrigins("http://localhost:5173", "https://wojciechwelfle.github.io", "https://safeframe.googlesyndication.com")
                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                         .allowedHeaders("*")
                         .allowCredentials(true);
             }
         };
     }
}
