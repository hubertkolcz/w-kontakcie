package com.example.wkontakcieapi.domain.school;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "school")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private int citySchoolId;
    private String name; //3
    private String address; //4
    private String postCode; //5
    private int numberOfChildren; //7
    private int numberOfClass; //8

}
