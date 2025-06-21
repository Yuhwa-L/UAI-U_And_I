package com.uai.uai_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.uai.uai_backend.config.QuestionAnswersConverter;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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
    private String gender;

    private String idImageBase64;
    private String selfieImageBase64;

    private String Bio;
    private String photoBase64;

    @Convert(converter = QuestionAnswersConverter.class)
    @Column(columnDefinition = "TEXT") // allows large JSON content
    private Map<String, String> questionAnswers = new HashMap<>();

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

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuestionAnswers(Map<String, String> questionAnswers) {
        this.questionAnswers = questionAnswers;
    }

    public Map<String, String> getQuestionAnswers(){
        return questionAnswers;
    }

    public String getBio() {
        return Bio;
    }

    public String getProfilePhoto() {
        return photoBase64;
    }

    public void setBio(String bio) {
        Bio = bio;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.photoBase64 = profilePhoto;
    }

    public void setGender(String value){
        gender = value;
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

    public Long getId() {
        return id;
    }

    public LocalDateTime getLocalDateTime() {
        return localDateTime;
    }

    public boolean isVerified() {
        return verified;
    }

    public String getVerificationMethod() {
        return verificationMethod;
    }

    public String getFullName() {
        return fullName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getEmergencyContactNumber() {
        return emergencyContactNumber;
    }

    public String getEmail(){
        return email;
    }

    public String getGender(){
        return gender;
    }
}
