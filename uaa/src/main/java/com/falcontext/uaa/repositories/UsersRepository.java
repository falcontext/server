package com.falcontext.uaa.repositories;

import com.falcontext.uaa.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<User, Long> {
    public Optional<User> findOneByEmail(String email);
}
