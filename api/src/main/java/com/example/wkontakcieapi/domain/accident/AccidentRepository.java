package com.example.wkontakcieapi.domain.accident;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccidentRepository extends JpaRepository<Accident, Long> {

    Optional<Accident> findAccidentByAddress(String address);
}
