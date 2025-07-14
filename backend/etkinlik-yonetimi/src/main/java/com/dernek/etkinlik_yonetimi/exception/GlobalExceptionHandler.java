package com.dernek.etkinlik_yonetimi.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.dernek.etkinlik_yonetimi.dto.response.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Validation hatalarını yakala
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
            .success(false)
            .error("Validation hatası: Gönderilen veriler geçersiz")
            .data(errors)
            .path(request.getRequestURI())
            .statusCode(400)
            .build();
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Genel hatalar için
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(
            RuntimeException ex, HttpServletRequest request) {
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
            .success(false)
            .error(ex.getMessage())
            .path(request.getRequestURI())
            .statusCode(500)
            .build();
            
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Dosya yükleme hatalar için
     */
    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<ApiResponse<Void>> handleIOException(
            java.io.IOException ex, HttpServletRequest request) {
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
            .success(false)
            .error("Dosya işlem hatası: " + ex.getMessage())
            .path(request.getRequestURI())
            .statusCode(400)
            .build();
            
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}