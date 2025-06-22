package com.uai.uai_backend.dto;

import lombok.Data;


@Data
public class BioRequest {
    private String email;
    private String bio;
    private base64Photo profilePhoto;

    public void setEmail(String value){
        this.email = value;
    }

    public void setBio(String value){
        this.bio = value;
    }

    public void setProfilePhoto(base64Photo value){
        this.profilePhoto = value;
    }

    public String getEmail(){
        return email;
    }

    public String getBio(){
        return bio;
    }

    public base64Photo getProfilePhoto(){
        return profilePhoto;
    }
}
