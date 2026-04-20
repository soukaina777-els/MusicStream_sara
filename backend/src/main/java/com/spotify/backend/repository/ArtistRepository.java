package com.spotify.backend.repository;

import com.spotify.backend.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    List<Artist> findByStatus(Artist.ArtistStatus status);
    Optional<Artist> findByAccountId(Long accountId);
}
