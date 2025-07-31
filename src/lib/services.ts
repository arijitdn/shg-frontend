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
