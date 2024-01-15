package com.example.springbootecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration  {

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity http) throws Exception {

        // Protect endpoint  /api/orders
        http.authorizeHttpRequests(requests ->
                requests
                        .requestMatchers("/api/orders/**")
                        .authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth2ResourceServer -> oauth2ResourceServer.jwt(
                        Customizer.withDefaults()));

        // Add CORS filter
        http.cors(Customizer.withDefaults());

        // Add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // Force a non-empty response body for 401 to make the response more friendly
        Okta.configureResourceServer401ResponseBody(http);

        // We are not using Cookies for session tracking >> disable CSRF
        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
