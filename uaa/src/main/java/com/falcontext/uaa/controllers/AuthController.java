package com.falcontext.uaa.controllers;

import com.falcontext.uaa.dto.AccountDTO;
import com.falcontext.uaa.entities.User;
import com.falcontext.uaa.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
public class AuthController {

    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private UsersRepository usersRepository;
    @Autowired
    AuthController(BCryptPasswordEncoder bCryptPasswordEncoder, UsersRepository usersRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/register")
    public void register(@RequestBody AccountDTO account) {
        account.setPassword(bCryptPasswordEncoder.encode(account.getPassword()));
        User user = account.transform();
        usersRepository.save(user);
//        List<User> users = usersRepository.findAll();
//        for (User mUser:users) {
//            System.out.println(mUser.toJSON());
//        }
    }

}
