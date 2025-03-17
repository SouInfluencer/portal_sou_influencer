import { useEffect, useCallback } from 'react';
import { logAnalyticsEvent } from '../../lib/firebase.ts';

export function useAnalytics() {
  // Track page view on mount
  useEffect(() => {
    logAnalyticsEvent('screen_view', {
      page_title: document.title,
      page_path: window.location.pathname
    });
  }, []);

  // Helper for tracking button clicks
  const trackButtonClick = useCallback((buttonName: string, category?: string) => {
    logAnalyticsEvent('button_click', {
      button_name: buttonName,
      event_category: category || 'interaction',
      event_label: buttonName
    });
  }, []);

  // Helper for tracking form submissions
  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    logAnalyticsEvent('form_submit', {
      form_name: formName,
      event_category: 'form',
      event_label: formName,
      success
    });
  }, []);

  // Helper for tracking errors
  const trackError = useCallback((errorType: string, errorMessage: string) => {
    logAnalyticsEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
      event_category: 'error'
    });
  }, []);

  return {
    trackButtonClick,
    trackFormSubmit,
    trackError,
    logEvent: logAnalyticsEvent
  };
}