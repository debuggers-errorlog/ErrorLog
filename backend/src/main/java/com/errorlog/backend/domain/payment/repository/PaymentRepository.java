package com.errorlog.backend.domain.payment.repository;


import com.errorlog.backend.domain.payment.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
}
