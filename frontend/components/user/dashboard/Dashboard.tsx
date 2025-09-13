"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  useAddSkill,
  useDeleteSkill,
  useUpdateSkill,
} from "@/lib/user-api/mutations/mutations";
import { fetchSkills } from "@/lib/user-api/queries/queries";

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function UserDashboard() {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState({ name: "", level: 1 });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Fetch skills query
  const {
    data: skills,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
    // Add retry logic and handle 401 errors
    retry: (failureCount, error: any) => {
      // Don't retry on 401 Unauthorized errors
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });

  // Add skill mutation
  const addSkillMutation = useAddSkill();

  // Delete skill mutation
  const deleteSkillMutation = useDeleteSkill();
  
  // Update skill mutation - initialized with null, will be set when user clicks edit
  const [updateSkillId, setUpdateSkillId] = useState<string | null>(null);
  const updateSkillMutation = useUpdateSkill(updateSkillId || '');

  // Handle adding a new skill
  const handleAddSkill = () => {
    if (!newSkill.name) return; 

    addSkillMutation.mutate(newSkill, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["skills"] });
        setNewSkill({ name: "", level: 1 });
      },
      onError: (error) => {
        console.error("Error adding skill:", error);
      },
    });
  };
  
  // Handle updating a skill
  const handleUpdateSkill = () => {
    if (!editingSkill || !editingSkill.name) return;
    
    setUpdateSkillId(editingSkill.id);
    
    updateSkillMutation.mutate(
      { name: editingSkill.name, level: editingSkill.level },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["skills"] });
          setEditingSkill(null); // Exit edit mode
          setUpdateSkillId(null);
        },
        onError: (error) => {
          console.error("Error updating skill:", error);
        },
      }
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Skill Tracker</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Skill name"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          min="1"
          max="10"
          value={newSkill.level}
          onChange={(e) =>
            setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
          }
          className="border p-2 w-20 mr-2"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={addSkillMutation.isPending || !newSkill.name}
        >
          {addSkillMutation.isPending ? "Adding..." : "Add Skill"}
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <div className="text-red-500">
          {error?.response?.status === 401 ? (
            <div>
              <p>Authentication error: Please log in again</p>
              <button
                onClick={() => (window.location.href = "/login")}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>Error loading skills: {error?.message || "Unknown error"}</>
          )}
        </div>
      ) : skills?.length === 0 ? (
        <p className="text-gray-500">
          No skills added yet. Add your first skill above!
        </p>
      ) : (
        <ul className="space-y-2">
          {skills?.map((skill: Skill) => (
            <li
              key={skill.id}
              className="p-4 border rounded shadow-sm"
            >
              {editingSkill && editingSkill.id === skill.id ? (
                // Edit mode
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={editingSkill.name}
                      onChange={(e) =>
                        setEditingSkill({ ...editingSkill, name: e.target.value })
                      }
                      className="border p-2 flex-grow"
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingSkill.level}
                      onChange={(e) =>
                        setEditingSkill({
                          ...editingSkill,
                          level: parseInt(e.target.value),
                        })
                      }
                      className="border p-2 w-20"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingSkill(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateSkill}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                      disabled={updateSkillMutation.isPending}
                    >
                      {updateSkillMutation.isPending ? "Updating..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{skill.name}</div>
                    <div>Level: {skill.level}</div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        deleteSkillMutation.mutate(skill.id, {
                          onSuccess: () => {
                            queryClient.invalidateQueries({ queryKey: ["skills"] });
                          },
                        });
                      }}
                      className="text-red-500 hover:text-red-700 ml-2"
                      disabled={deleteSkillMutation.isPending}
                    >
                      {deleteSkillMutation.isPending &&
                      deleteSkillMutation.variables === skill.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
