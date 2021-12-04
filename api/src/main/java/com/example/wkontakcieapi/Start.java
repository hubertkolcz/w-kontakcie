package com.example.wkontakcieapi;

import com.example.wkontakcieapi.domain.accident.Accident;
import com.example.wkontakcieapi.domain.accident.AccidentService;
import com.example.wkontakcieapi.domain.school.School;
import com.example.wkontakcieapi.domain.school.SchoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

@Component
@RequiredArgsConstructor
public class Start {

    private final SchoolService schoolService;
    private final AccidentService accidentService;

    @EventListener(ApplicationReadyEvent.class)
    public void init() throws FileNotFoundException {

        readSchoolFile();
        //readAccidentFile();
    }


    public void readSchoolFile() throws FileNotFoundException {
        Scanner sc = new Scanner(new File("src/main/resources/files/szkoły_podst_wro_publiczne.csv"));
        String line0 = sc.nextLine();
        while (sc.hasNextLine())
        {
            String line = sc.nextLine();
            String schoolArray[] = line.split(";");
            School school = School.builder()
                    .citySchoolId(Integer.parseInt(schoolArray[0]))
                    .name(schoolArray[3])
                    .address(schoolArray[4])
                    .postCode(schoolArray[5])
                    .numberOfChildren(Integer.parseInt(schoolArray[7]))
                    .numberOfClass(Integer.parseInt(schoolArray[8]))
                    .build();

            schoolService.createSchool(school);
        }
        sc.close();
    }

    public void readAccidentFile() throws FileNotFoundException {
        Scanner sc = new Scanner(new File("src/main/resources/files/2020_szczegoly_zdarzen_dr.csv"));
        String line0 = sc.nextLine();
        while (sc.hasNextLine())
        {
            String line = sc.nextLine();
            String accidentArray[] = line.split(";");
            Accident accident = Accident.builder()
                    .accidentAmount(Integer.parseInt(accidentArray[1]))
                    .victimAmount(Integer.parseInt(accidentArray[6]))
                    .deadVictimAmount(Integer.parseInt(accidentArray[8]))
                    .injuredVictimAmount(Integer.parseInt(accidentArray[11]+Integer.parseInt(accidentArray[14])))
                    .childrenAmount(Integer.parseInt(accidentArray[17]))
                    .date(accidentArray[18])
                    .address(accidentArray[19]+" " +accidentArray[20])
                    .weather(accidentArray[33])
                    .build();
            accidentService.createAccident(accident);
        }
        sc.close();
    }

}
