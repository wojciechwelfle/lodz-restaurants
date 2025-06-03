package com.lodzrestaurants.lodzrestaurants.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Lodz Restaurants API", version = "1.0")
)
public class OpenApiConfig {

        @Bean
        public OpenApiCustomizer tagsOrderCustomizer() {
                return openApi -> openApi.setTags(List.of(
                        new Tag().name("Authorization API").description("API for user authorization"),
                        new Tag().name("Restaurants API").description("API for managing restaurants in Lodz"),
                        new Tag().name("Menu API").description("API for managing menus"),
                        new Tag().name("Dish API").description("API for managing dishes in Lodz restaurants")
                ));
        }
}
