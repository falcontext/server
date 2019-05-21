package com.falcontext.uaa.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "account", schema="users")
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String password;
    private String role;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;
}
