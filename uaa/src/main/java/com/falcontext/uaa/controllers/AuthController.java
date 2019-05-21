package com.falcontext.uaa.controllers;

import com.falcontext.uaa.dto.AccountDTO;
import com.falcontext.uaa.entities.User;
import com.falcontext.uaa.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import sun.security.util.Password;

import java.util.List;
import java.util.Set;

@RestController
public class AuthController {

    private PasswordEncoder passwordEncoder;
    private UsersRepository usersRepository;

    @Autowired
    AuthController(PasswordEncoder passwordEncoder, UsersRepository usersRepository) {
        this.passwordEncoder = passwordEncoder;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/register")
    public void register(@RequestBody AccountDTO account) {
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        User user = account.transform();
        user.setRole("ROLE_USER");
        usersRepository.save(user);
    }

}
