import {
  PROGRESS_STATUS_PROCESSING,
  PROGRESS_STATUS_COMPLETED,
  PROGRESS_STATUS_ERROR,
  PROGRESS_STATUS_SKIPPED,
} from "../../../features/constants";

export const getStatusIcon = (status) => {
  switch (status) {
    case PROGRESS_STATUS_PROCESSING:
      return "⏳";
    case PROGRESS_STATUS_COMPLETED:
      return "✅";
    case PROGRESS_STATUS_ERROR:
      return "❌";
    case PROGRESS_STATUS_SKIPPED:
      return "⏭️";
    default:
      return "📄";
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case PROGRESS_STATUS_PROCESSING:
      return "Processing...";
    case PROGRESS_STATUS_COMPLETED:
      return "Completed";
    case PROGRESS_STATUS_ERROR:
      return "Error";
    case PROGRESS_STATUS_SKIPPED:
      return "Skipped (duplicate)";
    default:
      return "Waiting...";
  }
};
