package com.spotify.backend.controller;

import com.spotify.backend.config.JwtUtil;
import com.spotify.backend.dto.Dtos;
import com.spotify.backend.model.Artist;
import com.spotify.backend.repository.ArtistRepository;
import com.spotify.backend.service.AuthService;
import com.spotify.backend.service.PlayListService;
import com.spotify.backend.service.SongService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// ============ AUTH ============
@RestController
@RequestMapping("/api/auth")
class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Dtos.LoginRequest req) {
        try {
            return ResponseEntity.ok(Dtos.ApiResponse.ok(authService.login(req)));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Dtos.ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Dtos.SignupRequest req) {
        try {
            return ResponseEntity.ok(Dtos.ApiResponse.ok(authService.signup(req)));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Dtos.ApiResponse.error(e.getMessage()));
        }
    }
}

// ============ SONGS ============
@RestController
@RequestMapping("/api/songs")
class SongController {
    private final SongService songService;
    public SongController(SongService songService) { this.songService = songService; }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(songService.getAllApproved()));
    }

    @GetMapping("/top")
    public ResponseEntity<?> getTop(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(songService.getTopSongs(limit)));
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(songService.search(q)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(Dtos.ApiResponse.ok(songService.getById(id)));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<?> stream(@PathVariable Long id) {
        String url = songService.getStreamUrl(id);
        if (url != null) return ResponseEntity.ok(Dtos.ApiResponse.ok(url));
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam String title,
                                     @RequestParam String genre,
                                     @RequestParam(defaultValue = "EN") String language,
                                     @RequestParam Long artistId,
                                     @RequestParam MultipartFile audioFile) {
        try {
            return ResponseEntity.ok(Dtos.ApiResponse.ok(
                    songService.uploadSong(title, genre, language, artistId, audioFile)));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Dtos.ApiResponse.error(e.getMessage()));
        }
    }
}

// ============ ARTISTS ============
@RestController
@RequestMapping("/api/artists")
class ArtistController {
    private final ArtistRepository artistRepository;
    private final SongService songService;

    public ArtistController(ArtistRepository artistRepository, SongService songService) {
        this.artistRepository = artistRepository;
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Artist> artists = artistRepository.findByStatus(Artist.ArtistStatus.APPROVED);
        List<Dtos.ArtistDto> dtos = artists.stream().map(a ->
            new Dtos.ArtistDto(a.getId(), a.getName(), a.getImageUrl(),
                               a.getBio(), a.getTotalPlayCount())
        ).toList();
        return ResponseEntity.ok(Dtos.ApiResponse.ok(dtos));
    }

    @GetMapping("/{id}/songs")
    public ResponseEntity<?> getSongs(@PathVariable Long id) {
        List<Dtos.SongDto> songs = songService.getAllApproved().stream()
                .filter(s -> s.getArtist() != null && s.getArtist().getId().equals(id))
                .toList();
        return ResponseEntity.ok(Dtos.ApiResponse.ok(songs));
    }
}

// ============ PLAYLISTS ============
@RestController
@RequestMapping("/api/playlists")
class PlayListController {
    private final PlayListService playListService;
    private final JwtUtil jwtUtil;

    public PlayListController(PlayListService playListService, JwtUtil jwtUtil) {
        this.playListService = playListService;
        this.jwtUtil = jwtUtil;
    }

    private Long getUserId(String header) {
        if (header == null || !header.startsWith("Bearer "))
            throw new RuntimeException("Unauthorized");
        return jwtUtil.extractUserId(header.substring(7));
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(
                playListService.getUserPlaylists(getUserId(auth))));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestHeader("Authorization") String auth,
                                     @RequestBody Dtos.CreatePlayListRequest req) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(
                playListService.create(getUserId(auth), req.getName())));
    }

    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<?> addSong(@PathVariable Long id, @PathVariable Long songId) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(playListService.addSong(id, songId)));
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<?> removeSong(@PathVariable Long id, @PathVariable Long songId) {
        return ResponseEntity.ok(Dtos.ApiResponse.ok(playListService.removeSong(id, songId)));
    }
}
