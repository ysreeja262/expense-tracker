package com.expensetracker.backend.dto;

import com.expensetracker.backend.model.Expense;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExpenseResponse {
    private Long id;
    private LocalDateTime date;
    private BigDecimal amount;
    private Expense.Category category;
    private String description;
    private LocalDateTime createdAt;

    public ExpenseResponse(Long id, LocalDateTime date, BigDecimal amount, Expense.Category category, String description, LocalDateTime createdAt) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id; 
    }
    public LocalDateTime getDate() {
        return date; 
    }
    public BigDecimal getAmount() {
        return amount; 
    }
    public Expense.Category getCategory() {
        return category; 
    }
    public String getDescription() { 
        return description; 
    }
    public LocalDateTime getCreatedAt() {
         return createdAt; 
    }
}