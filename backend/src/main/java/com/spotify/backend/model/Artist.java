package com.spotify.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "artist")
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String bio;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "social_links")
    private String socialLinks;

    @Enumerated(EnumType.STRING)
    private ArtistStatus status;

    @Column(name = "total_play_count")
    private Long totalPlayCount;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;

    public enum ArtistStatus { APPROVED, PENDING, REJECTED }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSocialLinks() { return socialLinks; }
    public void setSocialLinks(String socialLinks) { this.socialLinks = socialLinks; }
    public ArtistStatus getStatus() { return status; }
    public void setStatus(ArtistStatus status) { this.status = status; }
    public Long getTotalPlayCount() { return totalPlayCount; }
    public void setTotalPlayCount(Long totalPlayCount) { this.totalPlayCount = totalPlayCount; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
}
