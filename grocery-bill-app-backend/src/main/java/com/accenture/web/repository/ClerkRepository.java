package com.accenture.web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.accenture.web.model.Clerk;

@Repository
public interface ClerkRepository extends JpaRepository<Clerk, String> {

}
