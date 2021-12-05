package com.example.wkontakcieapi.domain.accident;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "accident")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Accident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int accidentAmount; //1
    private int victimAmount; //6
    private int deadVictimAmount; //8
    private int injuredVictimAmount; //11+14
    private int childrenAmount; //17
    private String date; //18
    private String address; //19+20
    private String weather; //33

}
