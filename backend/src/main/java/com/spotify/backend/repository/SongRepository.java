package com.spotify.backend.repository;

import com.spotify.backend.model.Song;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findByStatus(Song.SongStatus status);

    @Query("SELECT s FROM Song s WHERE s.status = 'APPROVED' AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.artist.name) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Song> search(String q);

    @Query("SELECT s FROM Song s WHERE s.status = 'APPROVED' ORDER BY s.playCount DESC")
    List<Song> findTopSongs(Pageable pageable);
}
