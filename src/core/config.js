// Application configuration
export const config = {
  clerkPublishableKey: "pk_test_ZW1pbmVudC1zcG9uZ2UtMzEuY2xlcmsuYWNjb3VudHMuZGV2JA",
  appUrl: "http://localhost:5178",
  routes: {
    home: "/",
    register: "/register",
    verifyEmail: "/verify-email",
    ssoCallback: "/sso-callback",
    dashboard: "/dashboard/*",
    dashboardRoutes: {
      overview: "/dashboard/overview",
      learningProgress: "/dashboard/learning-progress",
      projects: "/dashboard/projects",
      achievements: "/dashboard/achievements",
      activity: "/dashboard/activity",
      dailyLog: "/dashboard/daily-log",
      backup: "/dashboard/backup",
      challenges: "/dashboard/challenges",
      community: "/dashboard/community",
      aiAssistant: "/dashboard/ai-assistant",
      resources: "/dashboard/resources",
      premium: "/dashboard/premium"
    }
  }
}; 