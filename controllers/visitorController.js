const Visitor = require("../models/Visitor");

// Validate required fields
const validateRequiredFields = ({ name, phone, purpose }) => {
  if (!name || !phone || !purpose) {
    return "Name, phone and purpose are required";
  }
  return null;
};

// Get all visitors
const getVisitors = async (req, res, next) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors,
    });
  } catch (error) {
    next(error);
  }
};

// Get visitor by ID
const getVisitorById = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

// Create visitor (check-in)
const createVisitor = async (req, res, next) => {
  try {
    const validationError = validateRequiredFields(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { name, phone, purpose } = req.body;

    const newVisitor = await Visitor.create({
      name,
      phone,
      purpose,
    });

    res.status(201).json({
      success: true,
      message: "Visitor checked in successfully",
      data: newVisitor,
    });
  } catch (error) {
    next(error);
  }
};

// Update visitor
const updateVisitor = async (req, res, next) => {
  try {
    const { name, phone, purpose, checkOut } = req.body;

    if (name === "" || phone === "" || purpose === "") {
      return res.status(400).json({
        success: false,
        message: "Name, phone and purpose cannot be empty",
      });
    }

    const updateData = { name, phone, purpose, checkOut };

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedVisitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visitor updated successfully",
      data: updatedVisitor,
    });
  } catch (error) {
    next(error);
  }
};

// Delete visitor
const deleteVisitor = async (req, res, next) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!deletedVisitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visitor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Optional: Checkout visitor (separate endpoint)
const checkOutVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { checkOut: new Date() },
      { new: true },
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      data: visitor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  checkOutVisitor,
};
