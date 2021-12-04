package com.example.wkontakcieapi.domain.accident;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/accidents")
@RequiredArgsConstructor
public class AccidentController {

    private final AccidentService accidentService;
    private static final String SCHOOL_NOT_FOUND = "Accident not found";

    @GetMapping
    public List<Accident> getAllAccidents() {
        return accidentService.getAllAccidents();
    }

    @GetMapping("/{id}")
    public Accident getAccidentById(@PathVariable Long id) {
        return accidentService.getAccidentById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
    }

    @GetMapping("/{address}")
    public Accident getAccidentByAddress(@PathVariable String address) {
        return accidentService.getAccidentsByAddress(address)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
    }

    @PostMapping
    public Accident createAccident(@RequestBody Accident accident) {
        return accidentService.createAccident(accident);
    }

//    @PutMapping("/{id}")
//    public Accident updateAccident(@PathVariable Long id,
//                              @RequestBody Accident accident) {
//        return accidentService.updateAccident(id, accident)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, SCHOOL_NOT_FOUND));
//    }

//    @DeleteMapping("/{id}")
//    public void deleteAccidentById(@PathVariable long id) {
//        accidentService.deleteAccidentById(id);
//    }

}
