import TenantPreference from "../models/tenant-pref-model.js";

// Create or update preferences
export const updatePreferences = async (req, res, next) => {
  try {
    const { propertyType, preferredLocations, budget } = req.body;

    const updated = await TenantPreference.findOneAndUpdate(
      { tenantId: req.user.id },
      { propertyType, preferredLocations, budget },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, preferences: updated });
  } catch (error) {
    next(error);
  }
};

// Get tenant preferences
export const getPreferences = async (req, res, next) => {
  try {
    const preferences = await TenantPreference.findOne({
      tenantId: req.user.id,
    });

    res.status(200).json({ success: true, preferences });
  } catch (error) {
    next(error);
  }
};
