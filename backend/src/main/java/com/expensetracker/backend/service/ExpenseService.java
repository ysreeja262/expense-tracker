package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getExpenses(
            Expense.Category category,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        if (category != null && fromDate != null && toDate != null)
            return expenseRepository
                .findByCategoryAndDateBetweenOrderByDateDesc(
                    category, fromDate, toDate);

        if (category != null)
            return expenseRepository
                .findByCategoryOrderByDateDesc(category);

        if (fromDate != null && toDate != null)
            return expenseRepository
                .findByDateBetweenOrderByDateDesc(fromDate, toDate);

        return expenseRepository.findAll();
    }

    public Expense addExpense(Expense expense) {
        expense.setCreatedAt(LocalDateTime.now());
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense updatedExpense) {
        Expense expense = expenseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setDate(updatedExpense.getDate());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());
        expense.setDescription(updatedExpense.getDescription());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }
}