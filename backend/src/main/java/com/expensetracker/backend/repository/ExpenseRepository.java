package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategoryOrderByDateDesc(
        Expense.Category category);

    List<Expense> findByDateBetweenOrderByDateDesc(
        LocalDateTime fromDate, LocalDateTime toDate);

    List<Expense> findByCategoryAndDateBetweenOrderByDateDesc(
        Expense.Category category,
        LocalDateTime fromDate,
        LocalDateTime toDate);
}