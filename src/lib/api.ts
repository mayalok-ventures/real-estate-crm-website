export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  teamSize?: string;
  requirement?: string;
  inquiryType?: string;
  role?: string;
  primaryProjectLocation?: string;
  _hp?: string;
  _ts?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  requestId?: string;
  message?: string;
  error?: string;
  data?: T;
}

export async function submitContactForm(data: ContactFormData): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to submit request. Please try again.",
      };
    }

    return {
      success: true,
      requestId: result.requestId,
      message: result.message || "Thank you. Our real estate solutions team will reach out shortly.",
    };
  } catch (err) {
    console.error("Client API Error:", err);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}
