package com.uai.uai_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String contactNumber;
    private String emergencyContactNumber;

    private String idImageBase64;
    private String selfieImageBase64;
    private String password;

    public String getEmail(){
        return email;
    }
    public String getFullName(){
        return fullName;
    }
    public String getContactNumber(){
        return contactNumber;
    }
    public String getEmergencyContactNumber(){
        return emergencyContactNumber;
    }
    public String getIdImageBase64(){
        return idImageBase64;
    }
    public String getSelfieImageBase64(){
        return selfieImageBase64;
    }
    public String getPassword(){ return password; }
}
