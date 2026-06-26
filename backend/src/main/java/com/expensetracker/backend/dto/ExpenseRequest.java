package com.expensetracker.backend.dto;

import com.expensetracker.backend.model.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ExpenseRequest {

    @NotNull(message = "Date is required")
    private LocalDateTime date;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private Expense.Category category;

    @NotBlank(message = "Description is required")
    private String description;

    public LocalDateTime getDate() { return date; }
    public BigDecimal getAmount() { return amount; }
    public Expense.Category getCategory() { return category; }
    public String getDescription() { return description; }

    public void setDate(LocalDateTime date) { this.date = date; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setCategory(Expense.Category category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
}