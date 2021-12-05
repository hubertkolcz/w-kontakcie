package com.example.wkontakcieapi.domain.accident;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccidentService {

    private final AccidentRepository accidentRepository;

    public List<Accident> getAllAccidents() {
        return accidentRepository.findAll();
    }

    public Optional<Accident> getAccidentsByAddress(String address) {
        return accidentRepository.findAccidentByAddress(address);
    }

    public Optional<Accident> getAccidentById(Long id) {
        return accidentRepository.findById(id);
    }

    public Accident createAccident(Accident accident) {
        return accidentRepository.save(accident);
    }


//    public Optional<Accident> updateAccident(Long id, Accident accident) {
//        return Optional.of(accidentRepository.existsById(id))
//                .filter(Boolean.TRUE::equals)
//                .map(ifExist -> accidentRepository.save(accident));
//    }
//
//    public void deleteAccidentById(Long id) {
//        accidentRepository.deleteById(id);
//    }

}