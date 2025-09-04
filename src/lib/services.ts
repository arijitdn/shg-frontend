import apiClient from "./api";

// Organization API functions
export const organizationApi = {
  // SHG APIs
  async createSHG(data: any) {
    return apiClient.post("/shg", data);
  },

  async getAllSHGs() {
    return apiClient.get("/shg");
  },

  async getSHGById(id: string) {
    return apiClient.get(`/shg/${id}`);
  },

  async updateSHG(id: string, data: any) {
    return apiClient.patch(`/shg/${id}`, data);
  },

  async deleteSHG(id: string) {
    return apiClient.delete(`/shg/${id}`);
  },

  // VO APIs
  async createVO(data: any) {
    return apiClient.post("/vo", data);
  },

  async getAllVOs() {
    return apiClient.get("/vo");
  },

  async getVOById(id: string) {
    return apiClient.get(`/vo/${id}`);
  },

  async updateVO(id: string, data: any) {
    return apiClient.patch(`/vo/${id}`, data);
  },

  async deleteVO(id: string) {
    return apiClient.delete(`/vo/${id}`);
  },

  // CLF APIs
  async createCLF(data: any) {
    return apiClient.post("/clf", data);
  },

  async getAllCLFs() {
    return apiClient.get("/clf");
  },

  async getCLFById(id: string) {
    return apiClient.get(`/clf/${id}`);
  },

  async updateCLF(id: string, data: any) {
    return apiClient.patch(`/clf/${id}`, data);
  },

  async deleteCLF(id: string) {
    return apiClient.delete(`/clf/${id}`);
  },
};

// Auth API functions
export const authApi = {
  async createMember(data: any) {
    return apiClient.post("/org-auth/create-member", data);
  },

  async createAdmin(data: any) {
    return apiClient.post("/org-auth/create-admin", data);
  },

  async login(data: any) {
    return apiClient.post("/org-auth/login", data);
  },

  async refreshToken(refreshToken: string) {
    return apiClient.post("/org-auth/refresh", { refreshToken });
  },

  async getProfile() {
    return apiClient.get("/org-auth/profile");
  },

  async getDetails(userId: string, shgId: string) {
    return apiClient.get(
      `/org-auth/get-details?userId=${userId}&shgId=${shgId}`
    );
  },
};

// Generic API functions
export const genericApi = {
  async get(endpoint: string) {
    return apiClient.get(endpoint);
  },

  async post(endpoint: string, data: any) {
    return apiClient.post(endpoint, data);
  },

  async patch(endpoint: string, data: any) {
    return apiClient.patch(endpoint, data);
  },

  async delete(endpoint: string) {
    return apiClient.delete(endpoint);
  },
};

// Product API functions
export const productApi = {
  async getAllProducts() {
    return apiClient.get("/products");
  },

  async getApprovedProducts() {
    return apiClient.get("/products?status=APPROVED");
  },

  async createProduct(formData: FormData) {
    return apiClient.post("/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async updateProduct(id: string, formData: FormData) {
    return apiClient.patch(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}`);
  },

  async approveProduct(id: string) {
    return apiClient.patch(`/products/${id}/approve`);
  },

  async rejectProduct(id: string, remarks?: string) {
    return apiClient.patch(`/products/${id}/reject`, { remarks });
  },
};

// Activities API functions
export const activitiesApi = {
  async getRecentActivities() {
    // Mock data for now - this should be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "1",
              title: "New SHG registered",
              description: "Mahila Shakti SHG registered in Rampur block",
              type: "registration",
              timestamp: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(),
              shgId: "shg_1",
              location: "Rampur",
            },
            {
              id: "2",
              title: "Product approved",
              description: "Handicraft product approved for marketplace",
              type: "product_approval",
              timestamp: new Date(
                Date.now() - 4 * 60 * 60 * 1000
              ).toISOString(),
              shgId: "shg_2",
              location: "Balrampur",
            },
            {
              id: "3",
              title: "Monthly meeting completed",
              description: "Swaraj Mahila SHG completed monthly review meeting",
              type: "meeting",
              timestamp: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
              shgId: "shg_3",
              location: "Gonda",
            },
            {
              id: "4",
              title: "Bulk order processed",
              description: "Order for 50 units of bamboo products processed",
              type: "order",
              timestamp: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              shgId: "shg_4",
              location: "Bahraich",
            },
            {
              id: "5",
              title: "Training session conducted",
              description: "Digital literacy training conducted for 25 members",
              type: "training",
              timestamp: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              shgId: "shg_5",
              location: "Shravasti",
            },
          ],
        });
      }, 100);
    });
  },

  async getSHGActivities(_shgId: string) {
    // Mock data for now - this should be replaced with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "1",
              title: "Monthly savings collection",
              description: "Monthly savings collection completed successfully",
              type: "savings",
              timestamp: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              id: "2",
              title: "New product added",
              description: "Added handmade pottery to product catalog",
              type: "product",
              timestamp: new Date(
                Date.now() - 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            {
              id: "3",
              title: "Training session",
              description: "Digital marketing training session conducted",
              type: "training",
              timestamp: new Date(
                Date.now() - 14 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
          ],
        });
      }, 100);
    });
  },
};
