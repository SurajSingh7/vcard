"use client";
import React from "react";

export default function EditCardModal({
  editingCard,
  editName,
  editNote,        // new prop for note value
  editContactNumber,
  editQrMobile,
  onNameChange,
  onNoteChange,    // new callback for note change
  onContactChange,
  onQrChange,
  onCancel,
  onSave,
  contactError,
  qrError,
}) {
  if (!editingCard) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="relative bg-white p-4 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Edit Card</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-orange-800">
              Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={onNameChange}
              className="w-full px-3 py-2 border border-orange-200 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-orange-800">
              Note
            </label>
            <input
              type="text"
              value={editNote}
              onChange={onNoteChange}
              className="w-full px-3 py-2 border border-orange-200 rounded"
            />
          </div>
          {editingCard.assignTo === "qrAdmin" ? (
            <div>
              <label className="block text-sm font-medium text-orange-800">
                QR Mobile
              </label>
              <input
                type="text"
                value={editQrMobile}
                onChange={onQrChange}
                maxLength="10"
                className="w-full px-3 py-2 border border-orange-200 rounded"
              />
              {qrError && (
                <p className="text-red-500 text-sm">{qrError}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-orange-800">
                Contact Number
              </label>
              <input
                type="text"
                value={editContactNumber}
                onChange={onContactChange}
                maxLength="10"
                className="w-full px-3 py-2 border border-orange-200 rounded"
              />
              {contactError && (
                <p className="text-red-500 text-sm">{contactError}</p>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-orange-200 text-orange-800 rounded hover:bg-orange-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}









