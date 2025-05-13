package org.example.cryptowallet.exceptions;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.sql.SQLException;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Element not found");
    }
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<String> handleNoSuchElementException(NoSuchElementException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Couldn't find this element");
    }
    @ExceptionHandler(SQLException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleSQLException(SQLException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("SQL Exception, probably bad input");
    }
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleGenericException(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Произошла ошибка: " + e.getMessage());
    }
}
