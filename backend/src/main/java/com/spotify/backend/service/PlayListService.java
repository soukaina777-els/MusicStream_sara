package com.spotify.backend.service;

import com.spotify.backend.dto.Dtos;
import com.spotify.backend.model.PlayList;
import com.spotify.backend.model.Song;
import com.spotify.backend.model.User;
import com.spotify.backend.repository.PlayListRepository;
import com.spotify.backend.repository.SongRepository;
import com.spotify.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlayListService {

    private final PlayListRepository playListRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final SongService songService;

    public PlayListService(PlayListRepository playListRepository, UserRepository userRepository,
                           SongRepository songRepository, SongService songService) {
        this.playListRepository = playListRepository;
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.songService = songService;
    }

    @Transactional

    public List<Dtos.PlayListDto> getUserPlaylists(Long userId) {
        return playListRepository.findByUserId(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional

    public Dtos.PlayListDto create(Long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        PlayList pl = new PlayList();
        pl.setName(name);
        pl.setUser(user);
        pl.setCreatedAt(LocalDateTime.now());
        pl.setSongs(new ArrayList<>());
        return toDto(playListRepository.save(pl));
    }


    @Transactional

    public Dtos.PlayListDto addSong(Long playlistId, Long songId) {
        PlayList pl = playListRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        pl.getSongs().add(song);
        return toDto(playListRepository.save(pl));
    }

    @Transactional
    public Dtos.PlayListDto removeSong(Long playlistId, Long songId) {
        PlayList pl = playListRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        pl.getSongs().removeIf(s -> s.getId().equals(songId));
        return toDto(playListRepository.save(pl));
    }

    @Transactional
    private Dtos.PlayListDto toDto(PlayList pl) {
        List<Dtos.SongDto> songs = pl.getSongs() == null ? new ArrayList<>() :
                pl.getSongs().stream().map(songService::toDto).collect(Collectors.toList());
        return new Dtos.PlayListDto(pl.getId(), pl.getName(), songs);
    }
}
