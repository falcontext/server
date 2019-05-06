package com.falcontext.uaa.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

public class BaseDTO {
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
