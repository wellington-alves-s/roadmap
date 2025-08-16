// API Base URL
const API_BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3003/api/v1" : "/api/v1";

// Função auxiliar para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token");
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(data.message || "Erro na requisição");
    }

    // Se a resposta não for um objeto JSON válido, envolve em um objeto
    if (typeof data === "string") {
      return { success: true, data };
    }

    // Se já tiver a estrutura esperada, retorna como está
    if (data.hasOwnProperty("success")) {
      return data;
    }

    // Caso contrário, envolve em um objeto com a estrutura esperada
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Erro na requisição:", error);
    return {
      success: false,
      error: error.message || "Erro ao processar requisição",
    };
  }
}

// Exporta as funções da API
window.api = {
  // Auth
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Progress
  getUserProgress: (userId) =>
    apiRequest(`/progress/user/${userId}`),

  // Topics
  getTopics: () =>
    apiRequest("/topics"),

  completeTopic: (userId, topicId) =>
    apiRequest(`/progress/complete/${userId}/${topicId}`, {
      method: "POST",
    }),

  // Achievements
  getAchievements: () =>
    apiRequest("/achievements"),

  getUserAchievements: (userId) =>
    apiRequest(`/achievements/user/${userId}`),

  // Notifications
  getNotifications: (userId) =>
    apiRequest(`/notifications/user/${userId}`),

  markNotificationAsRead: (notificationId) =>
    apiRequest(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    }),

  // Admin
  resetAndSeed: () =>
    apiRequest("/seed", {
      method: "POST",
    }),
};
