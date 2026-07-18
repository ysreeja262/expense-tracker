package com.expensetracker.backend.service;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.RecurringExpense;
import com.expensetracker.backend.repository.RecurringExpenseRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecurringExpenseService {

    private final RecurringExpenseRepository recurringExpenseRepository;

    public RecurringExpenseService(
            RecurringExpenseRepository recurringExpenseRepository) {
        this.recurringExpenseRepository = recurringExpenseRepository;
    }

    public List<RecurringExpense> getAllRecurringExpenses() {
        return recurringExpenseRepository.findAllByOrderByCreatedAtDesc();
    }

    public RecurringExpense addRecurringExpense(
            String description,
            BigDecimal amount,
            Expense.Category category,
            RecurringExpense.Frequency frequency) {

        RecurringExpense recurring = new RecurringExpense();
        recurring.setDescription(description);
        recurring.setAmount(amount);
        recurring.setCategory(category);
        recurring.setFrequency(frequency);
        recurring.setCreatedAt(LocalDateTime.now());

        return recurringExpenseRepository.save(recurring);
    }

    public void deleteRecurringExpense(Long id) {
        recurringExpenseRepository.deleteById(id);
    }
}