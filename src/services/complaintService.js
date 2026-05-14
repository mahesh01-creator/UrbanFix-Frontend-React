import api from './api';

export const complaintService = {

  // =========================================================
  // USER APIs
  // =========================================================

  issueComplaint: async (userId, complaintData) => {
    try {
      const formData = new FormData();

      formData.append('title', complaintData.title);
      formData.append('description', complaintData.description);
      formData.append('category', complaintData.category);
      formData.append('location', complaintData.location);
      formData.append('latitude', complaintData.latitude);
      formData.append('longitude', complaintData.longitude);

      if (complaintData.image) {
        formData.append('image', complaintData.image);
      }

      const response = await api.post(
        `/user/${userId}/issue-complaint`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Issue Complaint Error:', error);
      throw error;
    }
  },

  getUserComplaints: async (userId) => {
    try {
      const response = await api.get(
        `/user/${userId}/my-complaints`
      );

      return response.data;
    } catch (error) {
      console.error('Get User Complaints Error:', error);
      throw error;
    }
  },

  trackComplaint: async (userId, complaintId) => {
    try {
      const response = await api.get(
        `/user/${userId}/track-complaint/${complaintId}`
      );

      return response.data;
    } catch (error) {
      console.error('Track Complaint Error:', error);
      throw error;
    }
  },

  submitFeedback: async (
    userId,
    complaintId,
    feedback,
    rating
  ) => {
    try {
      const response = await api.put(
        `/user/${userId}/give-feedback/${complaintId}`,
        null,
        {
          params: {
            feedback,
            rating,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Submit Feedback Error:', error);
      throw error;
    }
  },



  // =========================================================
  // ADMIN APIs
  // =========================================================

  getAllComplaints: async (adminId) => {
    try {
      const response = await api.get(
        `/admin/${adminId}/all-complaints`
      );

      return response.data;
    } catch (error) {
      console.error('Get All Complaints Error:', error);
      throw error;
    }
  },

verifyComplaint: async (
  adminId,
  complaintId,
  isFake = false,
  rejectReason = ""
) => {
  try {

    const response = await api.put(
      `/admin/${adminId}/verify-complaint/${complaintId}`,
      null,
      {
        params: {
          isFake,
          reason: rejectReason,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      'Verify Complaint Error:',
      error
    );

    throw error;
  }
},
 
assignWorkerSmart: async (
  adminId,
  complaintId
) => {
  try {

    const response = await api.put(
      `/admin/${adminId}/assign-smart/${complaintId}`,
      {} // IMPORTANT
    );

    return response.data;

  } catch (error) {

    console.error(
      'Assign Worker Error:',
      error
    );

    throw error;
  }
},

assignWorkerManual: async (
  adminId,
  complaintId,
  workerId
) => {
  try {

    const response = await api.put(
      `/admin/${adminId}/assign-worker/${complaintId}/${workerId}`,
      {} // IMPORTANT
    );

    return response.data;

  } catch (error) {

    console.error(
      'Manual Assign Worker Error:',
      error
    );

    throw error;
  }
},

  getAllWorkers: async (adminId) => {
    try {
      const response = await api.get(
        `/admin/${adminId}/getAllWorkers`
      );

      return response.data;
    } catch (error) {
      console.error('Get Workers Error:', error);
      throw error;
    }
  },

 getComplaintById: async (id) => {
  try {
    const response = await api.get(
      `/admin/1/Monitor-Complaint/${id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Complaint By ID Error:",
      error
    );

    throw error;
  }
},

  filterComplaints: async (
    adminId,
    status = null,
    category = null
  ) => {
    try {
      const params = {};

      if (status) params.status = status;
      if (category) params.category = category;

      const response = await api.get(
        `/admin/${adminId}/Filter-Complaints/filterBy`,
        {
          params,
        }
      );

      return response.data;
    } catch (error) {
      console.error('Filter Complaints Error:', error);
      throw error;
    }
  },


  

  // =========================================================
  // WORKER APIs
  // =========================================================

  getWorkerComplaints: async (workerId) => {
    try {
      const response = await api.get(
        `/worker/${workerId}/myAll-complaints`
      );

      return response.data;
    } catch (error) {
      console.error('Get Worker Complaints Error:', error);
      throw error;
    }
  },

  getAssignedComplaints: async (workerId) => {
    try {
      const response = await api.get(
        `/worker/${workerId}/myAssign-complaints`
      );

      return response.data;
    } catch (error) {
      console.error('Get Assigned Complaints Error:', error);
      throw error;
    }
  },

  getResolvedComplaints: async (workerId) => {
    try {
      const response = await api.get(
        `/worker/${workerId}/myResolve-complaints`
      );

      return response.data;
    } catch (error) {
      console.error('Get Resolved Complaints Error:', error);
      throw error;
    }
  },

  startWork: async (
    workerId,
    complaintId
  ) => {
    try {
      const response = await api.put(
        `/worker/${workerId}/start-work/${complaintId}`
      );

      return response.data;
    } catch (error) {
      console.error('Start Work Error:', error);
      throw error;
    }
  },

  resolveComplaint: async (
    workerId,
    complaintId,
    notes,
    proofImage
  ) => {
    try {
      const formData = new FormData();

      formData.append('notes', notes);

      if (proofImage) {
        formData.append('proofImage', proofImage);
      }

      const response = await api.put(
        `/worker/${workerId}/resolve-work/${complaintId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Resolve Complaint Error:', error);
      throw error;
    }
  },

  getWorkerComplaintById: async (
  workerId,
  complaintId
) => {
  try {
    const response = await api.get(
      `/worker/${workerId}/complaint/${complaintId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      'Get Worker Complaint Error:',
      error
    );
    throw error;
  }
},

  updateWorkerLocation: async (
    workerId,
    latitude,
    longitude
  ) => {
    try {
      const response = await api.put(
        `/worker/${workerId}/update-location`,
        null,
        {
          params: {
            latitude,
            longitude,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Update Location Error:', error);
      throw error;
    }
  },
};