package com.example.wkontakcieapi.domain.school;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SchoolService {

    private final SchoolRepository schoolRepository;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public Optional<School> getSchoolsByCitySchoolId(int citySchoolId) {
        return schoolRepository.findSchoolByCitySchoolId(citySchoolId);
    }

    public Optional<School> getSchoolsByAddress(String address) {
        return schoolRepository.findSchoolByAddress(address);
    }

    public Optional<School> getSchoolById(Long id) {
        return schoolRepository.findById(id);
    }

    public School createSchool(School school) {
        return schoolRepository.save(school);
    }


//    public Optional<School> updateSchool(Long id, School school) {
//        return Optional.of(schoolRepository.existsById(id))
//                .filter(Boolean.TRUE::equals)
//                .map(ifExist -> schoolRepository.save(school));
//    }
//
//    public void deleteSchoolById(Long id) {
//        schoolRepository.deleteById(id);
//    }

}