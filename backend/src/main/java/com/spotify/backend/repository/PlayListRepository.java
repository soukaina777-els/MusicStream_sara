package com.spotify.backend.repository;

import com.spotify.backend.model.PlayList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlayListRepository extends JpaRepository<PlayList, Long> {
    List<PlayList> findByUserId(Long userId);
}
