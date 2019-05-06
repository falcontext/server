package com.falcontext.uaa.dto;

import com.falcontext.uaa.entities.BaseEntity;
import com.falcontext.uaa.entities.Profile;
import com.falcontext.uaa.entities.User;

public class AccountDTO extends BaseDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public User transform() {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        Profile profile = new Profile();
        profile.setFirstName(firstName);
        profile.setLastName(lastName);
        user.setProfile(profile);
        profile.setUser(user);
        return user;
    }
}
