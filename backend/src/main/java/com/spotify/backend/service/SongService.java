package com.spotify.backend.service;

import com.spotify.backend.dto.Dtos;
import com.spotify.backend.model.Artist;
import com.spotify.backend.model.Song;
import com.spotify.backend.repository.ArtistRepository;
import com.spotify.backend.repository.SongRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final MinioService minioService;

    public SongService(SongRepository songRepository, ArtistRepository artistRepository,
                       MinioService minioService) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.minioService = minioService;
    }

    public List<Dtos.SongDto> getAllApproved() {
        return songRepository.findByStatus(Song.SongStatus.APPROVED)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<Dtos.SongDto> search(String q) {
        return songRepository.search(q)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<Dtos.SongDto> getTopSongs(int limit) {
        return songRepository.findTopSongs(PageRequest.of(0, limit))
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public Dtos.SongDto getById(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setPlayCount(song.getPlayCount() == null ? 1L : song.getPlayCount() + 1);
        songRepository.save(song);
        return toDto(song);
    }

    public String getStreamUrl(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        if (song.getMinioKey() != null) {
            return minioService.getPresignedUrl(song.getMinioKey());
        }
        return null;
    }

    public Dtos.SongDto uploadSong(String title, String genre, String language,
                                    Long artistId, MultipartFile audioFile) throws Exception {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        String key = "audio/" + System.currentTimeMillis() + "_" + audioFile.getOriginalFilename();
        minioService.uploadFile(audioFile, key);

        Song song = new Song();
        song.setTitle(title);
        song.setGenre(genre);
        song.setLanguage(language);
        song.setArtist(artist);
        song.setMinioKey(key);
        song.setStatus(Song.SongStatus.APPROVED);
        song.setPlayCount(0L);
        song.setSubmittedAt(LocalDateTime.now());

        return toDto(songRepository.save(song));
    }

    public Dtos.SongDto toDto(Song s) {
        Dtos.ArtistDto artistDto = null;
        if (s.getArtist() != null) {
            Artist a = s.getArtist();
            artistDto = new Dtos.ArtistDto(
                a.getId(), a.getName(), a.getImageUrl(), a.getBio(), a.getTotalPlayCount());
        }
        String streamUrl = s.getMinioKey() != null
                ? minioService.getPresignedUrl(s.getMinioKey()) : null;
        return new Dtos.SongDto(
            s.getId(), s.getTitle(), s.getGenre(), s.getLanguage(),
            s.getPlayCount(), streamUrl, artistDto);
    }
}
