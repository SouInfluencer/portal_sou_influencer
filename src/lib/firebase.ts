import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAK4J9OU2VJ1iMoOcGI9uhmN0YEHeoSFBc",
  authDomain: "sou-influencer.firebaseapp.com",
  projectId: "sou-influencer",
  storageBucket: "sou-influencer.firebasestorage.app",
  messagingSenderId: "784667113740",
  appId: "1:784667113740:web:d543fc58c81c5ebba37129",
  measurementId: "G-SS3SYLC0DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics: Analytics | null = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Helper function to log events with error handling and validation
export const logAnalyticsEvent = async (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  try {
    if (!analytics) {
      console.warn('Analytics not initialized');
      return;
    }

    // Validate event parameters
    const validatedParams = {
      timestamp: new Date().toISOString(),
      page_location: window.location.href,
      ...eventParams
    };

    await logEvent(analytics, eventName, validatedParams);
  } catch (error) {
    console.error('Failed to log analytics event:', error);
  }
};

// Custom event types
export const AnalyticsEvents = {
  PAGE_VIEW: 'screen_view',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  FORM_ERROR: 'form_error',
  CALCULATOR_USE: 'calculator_use',
  WAITLIST_SIGNUP: 'waitlist_signup'
} as const;

export type AnalyticsEventType = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];