package com.expensetracker.backend.controller;

import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.RecurringExpense;
import com.expensetracker.backend.service.RecurringExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recurring")
public class RecurringExpenseController {

    private final RecurringExpenseService recurringExpenseService;

    public RecurringExpenseController(
            RecurringExpenseService recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }

    @GetMapping
    public ResponseEntity<List<RecurringExpense>> getAll() {
        return ResponseEntity.ok(
            recurringExpenseService.getAllRecurringExpenses()
        );
    }

    @PostMapping
    public ResponseEntity<RecurringExpense> add(
            @RequestBody Map<String, String> body) {
        String description = body.get("description");
        BigDecimal amount = new BigDecimal(body.get("amount"));
        Expense.Category category =
            Expense.Category.valueOf(body.get("category"));
        RecurringExpense.Frequency frequency =
            RecurringExpense.Frequency.valueOf(body.get("frequency"));

        return ResponseEntity.ok(
            recurringExpenseService.addRecurringExpense(
                description, amount, category, frequency)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recurringExpenseService.deleteRecurringExpense(id);
        return ResponseEntity.noContent().build();
    }
}