package com.spotify.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "song")
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String genre;
    private String language;
    private String lyrics;

    @Column(name = "play_count")
    private Long playCount;

    @Column(name = "favorite")
    private Long favorite;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    private SongStatus status;

    @Column(name = "mp3file")
    private String minioKey;

    @Column(name = "cover_image")
    private String coverImage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "artist_id")
    private Artist artist;

    public enum SongStatus { APPROVED, PENDING, REJECTED }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getLyrics() { return lyrics; }
    public void setLyrics(String lyrics) { this.lyrics = lyrics; }
    public Long getPlayCount() { return playCount; }
    public void setPlayCount(Long playCount) { this.playCount = playCount; }
    public Long getFavorite() { return favorite; }
    public void setFavorite(Long favorite) { this.favorite = favorite; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public SongStatus getStatus() { return status; }
    public void setStatus(SongStatus status) { this.status = status; }
    public String getMinioKey() { return minioKey; }
    public void setMinioKey(String minioKey) { this.minioKey = minioKey; }
    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) { this.artist = artist; }

    public String getCoverImage() { return coverImage; }
public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
}
