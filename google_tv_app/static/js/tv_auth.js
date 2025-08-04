/**
 * ChordSync TV Authentication
 * 
 * This script handles the authentication flow for the TV app.
 */

// Add any authentication-specific JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    // Highlight the auth button when focused (for remote control navigation)
    const authButton = document.querySelector('.auth-button');
    
    if (authButton) {
        // Add focus event listener
        authButton.addEventListener('focus', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 20px rgba(29, 185, 84, 0.5)';
        });
        
        // Add blur event listener
        authButton.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Set initial focus to the auth button for remote control navigation
        authButton.focus();
    }
});