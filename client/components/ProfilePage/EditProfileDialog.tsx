"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import SecondaryBtn from "../SharedComponents/Btns/SecondaryBtn";
import PrimaryBtn from "../SharedComponents/Btns/PrimaryBtn";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { role?: string; bio?: string }) => Promise<void> | void;
  currentRole?: string;
  currentBio?: string;
}

export default function EditProfileDialog({
  isOpen,
  onClose,
  onSave,
  currentRole = "",
  currentBio = "",
}: EditProfileDialogProps) {
  const [role, setRole] = useState(currentRole);
  const [bio, setBio] = useState(currentBio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRole(currentRole || "");
      setBio(currentBio || "");
    }
  }, [isOpen, currentRole, currentBio]);

  async function handleSave() {
    try {
      setSaving(true);
      await onSave({
        role: role.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const handleCancel = () => {
    setRole(currentRole || "");
    setBio(currentBio || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Role/Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Data Scientist, ML Engineer"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">{role.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <SecondaryBtn onClick={handleCancel} className="flex-1" disabled={saving}>
            Cancel
          </SecondaryBtn>
          <PrimaryBtn onClick={handleSave} className="flex-1" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}
