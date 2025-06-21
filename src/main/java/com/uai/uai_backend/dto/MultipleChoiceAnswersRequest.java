package com.uai.uai_backend.dto;

import lombok.Data;

import java.util.Map;

@Data
public class MultipleChoiceAnswersRequest {
    private String email;
    private Map<String, String> answers;
    public void setEmail(String value){
        this.email = value;
    }
    public String getEmail(){
        return email;
    }
    public void setAnswers(Map<String, String> answers) {
        this.answers = answers;
    }

    public Map<String, String> getAnswers() {
        return answers;
    }
}
