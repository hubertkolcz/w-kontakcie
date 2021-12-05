package com.example.wkontakcieapi.domain.school;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;
    private static final String SCHOOL_NOT_FOUND = "School not found";

    @GetMapping
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping("/{id}")
    public School getSchoolById(@PathVariable Long id) {
        return schoolService.getSchoolById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
    }

    @GetMapping("/id/{citySchoolId}")
    public School getSchoolByCitySchoolId(@PathVariable int citySchoolId) {
        return schoolService.getSchoolsByCitySchoolId(citySchoolId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
    }

    @GetMapping("/{address}")
    public School getSchoolByAddress(@PathVariable String address) {
        return schoolService.getSchoolsByAddress(address)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
    }

    @PostMapping
    public School createSchool(@RequestBody School school) {
        return schoolService.createSchool(school);
    }

//    @PutMapping("/{id}")
//    public School updateSchool(@PathVariable Long id,
//                              @RequestBody School school) {
//        return schoolService.updateSchool(id, school)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
//    }

//    @DeleteMapping("/{id}")
//    public void deleteSchoolById(@PathVariable long id) {
//        schoolService.deleteSchoolById(id);
//    }

}
