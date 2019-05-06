package com.falcontext.uaa.entities;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import javax.persistence.*;
import java.util.Date;

public class BaseEntity {

    @Basic(optional = false)
    @CreationTimestamp
    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    protected Date createdAt = new Date(); // initialize created date

    @UpdateTimestamp
    @Column(name = "last_modified")
    @Temporal(TemporalType.TIMESTAMP)

    protected Date updatedAt=new Date();

    @PreUpdate
    public void setUpdatedAt() {
        this.updatedAt= new Date();
    }

    public String toJSON() {
        Jackson2ObjectMapperBuilder builder = Jackson2ObjectMapperBuilder.json();
        ObjectMapper mapper = builder.build();
        try {
            return mapper.writeValueAsString(this);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }


}
