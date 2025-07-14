package com.dernek.etkinlik_yonetimi.dto.response;

import java.time.LocalDateTime;

/**
 * Generic API Response wrapper
 * Tüm API response'ları için standart format sağlar
 * 
 * @param <T> Response data'nın tipi
 */
public class ApiResponse<T> {
    
    private boolean success;
    private String message;
    private T data;
    private String error;
    private LocalDateTime timestamp;
    private String path;
    private int statusCode;
    
    // Private constructor - Builder pattern için
    private ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructors
    public ApiResponse(boolean success, String message, T data) {
        this();
        this.success = success;
        this.message = message;
        this.data = data;
        this.statusCode = success ? 200 : 400;
    }
    
    // Static factory methods - Success
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "İşlem başarılı", data);
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
    
    // Static factory methods - Error
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>(false, null, null);
        response.error = message;
        response.statusCode = 400;
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message, int statusCode) {
        ApiResponse<T> response = new ApiResponse<>(false, null, null);
        response.error = message;
        response.statusCode = statusCode;
        return response;
    }
    
    public static <T> ApiResponse<T> error(String message, T data, int statusCode) {
        ApiResponse<T> response = new ApiResponse<>(false, null, data);
        response.error = message;
        response.statusCode = statusCode;
        return response;
    }
    
    // Builder pattern
    public static <T> ApiResponseBuilder<T> builder() {
        return new ApiResponseBuilder<>();
    }
    
    // Getters & Setters
    public boolean isSuccess() { 
        return success; 
    }
    
    public void setSuccess(boolean success) { 
        this.success = success; 
    }
    
    public String getMessage() { 
        return message; 
    }
    
    public void setMessage(String message) { 
        this.message = message; 
    }
    
    public T getData() { 
        return data; 
    }
    
    public void setData(T data) { 
        this.data = data; 
    }
    
    public String getError() { 
        return error; 
    }
    
    public void setError(String error) { 
        this.error = error; 
    }
    
    public LocalDateTime getTimestamp() { 
        return timestamp; 
    }
    
    public void setTimestamp(LocalDateTime timestamp) { 
        this.timestamp = timestamp; 
    }
    
    public String getPath() { 
        return path; 
    }
    
    public void setPath(String path) { 
        this.path = path; 
    }
    
    public int getStatusCode() { 
        return statusCode; 
    }
    
    public void setStatusCode(int statusCode) { 
        this.statusCode = statusCode; 
    }
    
    // Builder Class
    public static class ApiResponseBuilder<T> {
        private ApiResponse<T> response;
        
        public ApiResponseBuilder() {
            this.response = new ApiResponse<>();
        }
        
        public ApiResponseBuilder<T> success(boolean success) {
            response.success = success;
            return this;
        }
        
        public ApiResponseBuilder<T> message(String message) {
            response.message = message;
            return this;
        }
        
        public ApiResponseBuilder<T> data(T data) {
            response.data = data;
            return this;
        }
        
        public ApiResponseBuilder<T> error(String error) {
            response.error = error;
            response.success = false;
            return this;
        }
        
        public ApiResponseBuilder<T> path(String path) {
            response.path = path;
            return this;
        }
        
        public ApiResponseBuilder<T> statusCode(int statusCode) {
            response.statusCode = statusCode;
            return this;
        }
        
        public ApiResponse<T> build() {
            // Default değerler
            if (response.statusCode == 0) {
                response.statusCode = response.success ? 200 : 400;
            }
            return response;
        }
    }
    
    @Override
    public String toString() {
        return String.format("ApiResponse{success=%s, message='%s', data=%s, error='%s', timestamp=%s}", 
                success, message, data, error, timestamp);
    }
}