package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.Budget;
import com.expensetracker.backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByCategory(Expense.Category category);

    List<Budget> findAllByOrderByCategoryAsc();
}