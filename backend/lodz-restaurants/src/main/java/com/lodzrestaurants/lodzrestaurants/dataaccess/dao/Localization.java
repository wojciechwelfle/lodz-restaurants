package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "localization")
@Getter
@Setter
public class Localization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "localization_id", nullable = false)
    private Long localizationId;
    @Column(name = "latitude", nullable = false)
    private double latitude;
    @Column(name = "longitude", nullable = false)
    private double longitude;

    public Localization() {
    }

    public Localization(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
