package com.lodzrestaurants.lodzrestaurants.dataaccess.dao;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "reservation_table")
@Getter
@Setter
public class ReservationTable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "table_id", nullable = false)
    private Long reservationId;

    @Column(name = "table_number", nullable = false)
    private int tableNumber;

    @Column(name = "seats", nullable = false)
    private int seats;

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "hour", nullable = false)
    private long hour;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "email")
    private String email;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
}
