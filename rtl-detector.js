/**
 * RTL (Right-to-Left) Language Auto-Detector
 * This script automatically detects when the page is translated to an RTL language
 * and applies the proper text direction and Bootstrap RTL styles.
 */

// List of RTL (Right-to-Left) language codes
// These languages are written from right to left
const RTL_LANGUAGES = [
  'ar',    // Arabic
  'he',    // Hebrew
  'ur',    // Urdu
  'fa',    // Persian/Farsi
  'yi',    // Yiddish
  'arc',   // Aramaic
  'ckb',   // Central Kurdish (Sorani)
  'dv',    // Dhivehi/Maldivian
  'ha',    // Hausa (when written in Arabic script)
  'khw',   // Khowar
  'ks',    // Kashmiri
  'ku',    // Kurdish
  'ps',    // Pashto
  'sd',    // Sindhi
  'ug',    // Uyghur
];

/**
 * Check if a language code is RTL
 * @param {string} langCode - Language code (e.g., 'ar', 'en', 'he')
 * @returns {boolean} - True if language is RTL
 */
function isRTL(langCode) {
  // Extract the base language code (e.g., 'ar' from 'ar-SA')
  const baseLang = langCode.toLowerCase().split('-')[0];
  return RTL_LANGUAGES.includes(baseLang);
}

/**
 * Apply RTL styles and direction to the page
 */
function applyRTL() {
  console.log('Applying RTL layout...');
  
  // Set the text direction to right-to-left
  document.documentElement.setAttribute('dir', 'rtl');
  
  // Add Bootstrap RTL stylesheet if not already present
  if (!document.getElementById('bootstrap-rtl')) {
    const rtlLink = document.createElement('link');
    rtlLink.id = 'bootstrap-rtl';
    rtlLink.rel = 'stylesheet';
    rtlLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
    document.head.appendChild(rtlLink);
  }
  
  // Add a custom class to body for additional RTL styling if needed
  document.body.classList.add('rtl-active');
}

/**
 * Remove RTL styles and reset to LTR (Left-to-Right)
 */
function applyLTR() {
  console.log('Applying LTR layout...');
  
  // Set the text direction to left-to-right
  document.documentElement.setAttribute('dir', 'ltr');
  
  // Remove Bootstrap RTL stylesheet if present
  const rtlLink = document.getElementById('bootstrap-rtl');
  if (rtlLink) {
    rtlLink.remove();
  }
  
  // Remove the RTL class from body
  document.body.classList.remove('rtl-active');
}

/**
 * Check current language and apply appropriate direction
 */
function checkLanguageAndApplyDirection() {
  // Get the current language from the HTML lang attribute
  const currentLang = document.documentElement.getAttribute('lang') || 'en';
  
  console.log('Current language:', currentLang);
  
  // Apply RTL or LTR based on the language
  if (isRTL(currentLang)) {
    applyRTL();
  } else {
    applyLTR();
  }
}

/**
 * Monitor for language changes using MutationObserver
 * This detects when Google Translate or other tools change the lang attribute
 */
function startLanguageMonitoring() {
  // Create a MutationObserver to watch for attribute changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Check if the 'lang' attribute changed
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        console.log('Language change detected!');
        checkLanguageAndApplyDirection();
      }
    });
  });
  
  // Start observing the <html> element for attribute changes
  observer.observe(document.documentElement, {
    attributes: true,           // Watch for attribute changes
    attributeFilter: ['lang']   // Only watch the 'lang' attribute
  });
  
  console.log('Language monitoring started');
}

/**
 * Detect Google Translate widget changes
 * Google Translate adds special elements when translating
 */
function detectGoogleTranslate() {
  // Check for Google Translate elements in the page
  const checkInterval = setInterval(function() {
    // Google Translate adds a class or elements when active
    const translateElement = document.querySelector('.goog-te-banner-frame');
    const translatedClass = document.body.classList.contains('translated-ltr') || 
                           document.body.classList.contains('translated-rtl');
    
    if (translateElement || translatedClass) {
      console.log('Google Translate detected');
      checkLanguageAndApplyDirection();
    }
  }, 1000); // Check every second
  
  // Stop checking after 30 seconds to save resources
  setTimeout(function() {
    clearInterval(checkInterval);
    console.log('Google Translate detection stopped');
  }, 30000);
}

/**
 * Initialize the RTL detector when the page loads
 */
function init() {
  console.log('RTL Detector initialized');
  
  // Check the initial language and apply direction
  checkLanguageAndApplyDirection();
  
  // Start monitoring for language changes
  startLanguageMonitoring();
  
  // Detect Google Translate
  detectGoogleTranslate();
  
  // Also check when the page becomes visible (in case user switches tabs)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      checkLanguageAndApplyDirection();
    }
  });
}

// Run the init function when the page finishes loading
if (document.readyState === 'loading') {
  // Page is still loading, wait for DOMContentLoaded event
  document.addEventListener('DOMContentLoaded', init);
} else {
  // Page already loaded, run init immediately
  init();
}

// Also expose a manual function to force RTL/LTR for testing
window.forceRTL = applyRTL;
window.forceLTR = applyLTR;
