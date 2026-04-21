package com.spotify.backend.dto;

import java.util.List;

public class Dtos {

    public static class LoginRequest {
        private String email;
        private String password;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class LoginResponse {
        private String token;
        private String email;
        private String name;
        private Long userId;
        public LoginResponse() {}
        public LoginResponse(String token, String email, String name, Long userId) {
            this.token = token; this.email = email;
            this.name = name; this.userId = userId;
        }
        public String getToken() { return token; }
        public String getEmail() { return email; }
        public String getName() { return name; }
        public Long getUserId() { return userId; }
    }

    public static class ArtistDto {
        private Long id;
        private String name;
        private String imageUrl;
        private String bio;
        private Long totalPlayCount;
        public ArtistDto() {}
        public ArtistDto(Long id, String name, String imageUrl, String bio, Long totalPlayCount) {
            this.id = id; this.name = name; this.imageUrl = imageUrl;
            this.bio = bio; this.totalPlayCount = totalPlayCount;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
        public String getImageUrl() { return imageUrl; }
        public String getBio() { return bio; }
        public Long getTotalPlayCount() { return totalPlayCount; }
    }

    public static class SongDto {
    private Long id;
    private String title;
    private String genre;
    private String language;
    private Long playCount;
    private String streamUrl;
    private ArtistDto artist;
    private String coverUrl;  // ← nouveau

    public SongDto() {}
    public SongDto(Long id, String title, String genre, String language,
                   Long playCount, String streamUrl, ArtistDto artist, String coverUrl) {
        this.id = id; this.title = title; this.genre = genre;
        this.language = language; this.playCount = playCount;
        this.streamUrl = streamUrl; this.artist = artist;
        this.coverUrl = coverUrl;  // ← nouveau
        }
        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getGenre() { return genre; }
        public String getLanguage() { return language; }
        public Long getPlayCount() { return playCount; }
        public String getStreamUrl() { return streamUrl; }
        public ArtistDto getArtist() { return artist; }
        public String getCoverUrl() { return coverUrl; }  // ← nouveau
    }

    public static class PlayListDto {
        private Long id;
        private String name;
        private List<SongDto> songs;
        public PlayListDto() {}
        public PlayListDto(Long id, String name, List<SongDto> songs) {
            this.id = id; this.name = name; this.songs = songs;
        }
        public Long getId() { return id; }
        public String getName() { return name; }
        public List<SongDto> getSongs() { return songs; }
    }

    public static class CreatePlayListRequest {
        private String name;
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse() {}
        public ApiResponse(boolean success, String message, T data) {
            this.success = success; this.message = message; this.data = data;
        }

        public static <T> ApiResponse<T> ok(T data) {
            ApiResponse<T> r = new ApiResponse<>();
            r.success = true; r.message = "OK"; r.data = data;
            return r;
        }

        public static <T> ApiResponse<T> error(String msg) {
            ApiResponse<T> r = new ApiResponse<>();
            r.success = false; r.message = msg; r.data = null;
            return r;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public T getData() { return data; }
    }

    public static class SignupRequest {
    private String email;
    private String password;
    private String name;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
}
