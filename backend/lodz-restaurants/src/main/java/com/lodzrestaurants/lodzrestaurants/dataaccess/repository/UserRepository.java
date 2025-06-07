package com.lodzrestaurants.lodzrestaurants.dataaccess.repository;


import com.lodzrestaurants.lodzrestaurants.dataaccess.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

}
