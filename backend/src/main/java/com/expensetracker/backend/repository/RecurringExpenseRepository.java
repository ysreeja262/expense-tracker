package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.RecurringExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecurringExpenseRepository
    extends JpaRepository<RecurringExpense, Long> {

    List<RecurringExpense> findAllByOrderByCreatedAtDesc();
}