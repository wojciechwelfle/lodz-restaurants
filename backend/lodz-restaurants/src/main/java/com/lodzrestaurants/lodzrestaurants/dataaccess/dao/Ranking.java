package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ranking")
@Getter
@Setter
public class Ranking {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ranking_id", nullable = false)
    private Long rankingId;

    @Column(name = "ranking_value", nullable = false)
    private Double rankingValue;

    public Ranking() {
    }

    public Ranking(Double rankingValue) {
        if(rankingValue < 1 || rankingValue > 5) {
            throw new IllegalArgumentException("Ranking value must be between 0 and 5");
        }
        this.rankingValue = rankingValue;
    }
}
