"use client";
import React from "react";

export default function RescheduleModal({
  show,
  cardId,
  oldDate,
  newDate,
  setNewDate,
  reason,
  setReason,
  onClose,
  onSubmit,
  formatDateForInput,
  track,
}) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white p-4 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Reschedule Date</h2>
        <div className="space-y-4">
          {/* First row: Old Scheduled Date and Track */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-orange-800">
                Old Scheduled Date
              </label>
              <input
                type="date"
                value={oldDate ? formatDateForInput(oldDate) : ""}
                disabled
                className="w-full px-3 py-2 border border-orange-200 rounded bg-gray-100"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-orange-800">
                Track
              </label>
              <input
                type="text"
                value={track}
                readOnly
                disabled
                className="w-full px-3 py-2 border border-orange-200 rounded bg-gray-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-800">
              New Scheduled Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={oldDate ? formatDateForInput(oldDate) : undefined}
              max={
                oldDate
                  ? formatDateForInput(
                      new Date(new Date(oldDate).setMonth(new Date(oldDate).getMonth() + 1))
                    )
                  : undefined
              }
              className="w-full px-3 py-2 border border-orange-200 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-800">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-orange-200 rounded"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit();
              window.location.reload();
            }}
            className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
