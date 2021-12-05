package com.example.wkontakcieapi.domain.school;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {

    Optional<School> findSchoolByCitySchoolId(int citySchoolId);
    Optional<School> findSchoolByAddress(String address);
}
