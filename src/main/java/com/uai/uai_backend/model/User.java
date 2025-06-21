package com.uai.uai_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "boolean default false")
    private boolean verified;

    @UpdateTimestamp
    private LocalDateTime localDateTime;

    private String verificationMethod;

    private String fullName;

    @Column(unique = true)
    private String email;
    private String contactNumber;
    private String emergencyContactNumber;
    private String password;

    private String idImageBase64;
    private String selfieImageBase64;

    public void setEmail(String mail){
        email = mail;
    }
    public void setFullName(String name){
        fullName = name;
    }
    public void setContactNumber(String number){
        contactNumber = number;
    }
    public void setEmergencyContactNumber(String number){
        emergencyContactNumber = number;
    }
    public void setIdImageBase64(String idImage){
        idImageBase64 = idImage;
    }
    public void setSelfieImageBase64(String selfieImage){
        selfieImageBase64 = selfieImage;
    }
    public void setPassword(String pass){
        password = pass;
    }
    public void setVerified(boolean value){
        verified = value;
    }
    public void setLocalDateTime(LocalDateTime value){
        localDateTime = value;
    }
    public void setVerificationMethod(String value){
        verificationMethod = value;
    }
    public String getPassword() {
        return password;
    }

    public String getIdImageBase64() {
        return idImageBase64;
    }

    public String getSelfieImageBase64() {
        return selfieImageBase64;
    }

    public String getEmail(){
        return email;
    }
}
