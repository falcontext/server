package com.falcontext.uaa.configs;

import com.falcontext.uaa.entities.User;
import com.falcontext.uaa.errors.CustomAccessDeniedHandler;
import com.falcontext.uaa.errors.CustomAuthenticationEntryPoint;
import com.falcontext.uaa.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;

import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true, proxyTargetClass = true)
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {

        private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

//        private final UserDetailsService userDetailsService;

        @Autowired
        private PasswordEncoder passwordEncoder;

        public BCryptPasswordEncoder bCryptPasswordEncoder() {
                return new BCryptPasswordEncoder();
        }
        @Autowired
        private AccountService accountService;

        public ServerSecurityConfig(CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {
                this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
        }
//
//        @Bean
//        public DaoAuthenticationProvider authenticationProvider() {
//                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//                provider.setPasswordEncoder(passwordEncoder());
//                provider.setUserDetailsService(accountService);
//                return provider;
//        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                String idForEncode = "bcrypt";
                Map<String, PasswordEncoder> encoderMap = new HashMap<>();
                encoderMap.put(idForEncode, new BCryptPasswordEncoder());
                return new DelegatingPasswordEncoder(idForEncode, encoderMap);
        }

        @Bean
        @Override
        public AuthenticationManager authenticationManagerBean() throws Exception {
                return super.authenticationManagerBean();
        }

        @Override
        protected void configure(HttpSecurity http) throws Exception {
                http
                        .csrf().disable()
                        .authorizeRequests()
                        .antMatchers("/register**").permitAll()
                        .anyRequest().authenticated()
//                        .antMatchers("/api/glee/**").hasAnyAuthority("ADMIN", "USER")
//                        .antMatchers("/api/users/**").hasAuthority("ADMIN")
//                        .antMatchers("/api/**").authenticated()


                        .and().exceptionHandling().authenticationEntryPoint(customAuthenticationEntryPoint).accessDeniedHandler(new CustomAccessDeniedHandler())
                        .and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ;
        }

        @Override
        protected void configure(AuthenticationManagerBuilder auth) throws Exception {
                auth.userDetailsService(accountService)
                        .passwordEncoder(bCryptPasswordEncoder());
//                        .and()
//                        .inMemoryAuthentication();
//                        .withUser("falcontext_client").password(passwordEncoder.encode("client"))
//                        .roles("USER");
        }

}