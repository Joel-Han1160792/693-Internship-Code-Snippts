import React, { useState } from "react";
import { Team } from "../../utils/api/endpoints/team/teamManagement";

interface ManageTeamProps {
  teams: Team[];
  onCreateTeam: (team: Omit<Team, "team_id" | "role" | "joined_at">) => void;
  onUpdateTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
}

const ManageTeam: React.FC<ManageTeamProps> = ({
  teams,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam
}) => {
  const [newTeam, setNewTeam] = useState({
    team_name: "",
    team_description: ""
  });
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeam.team_name === "") {
      setError("Team name is required");
      return;
    }
    if (newTeam.team_description === "") {
      setError("Team description is required");
      return;
    }
    onCreateTeam(newTeam);
    setNewTeam({ team_name: "", team_description: "" });
    setError(null);
  };

  const handleUpdateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeam) {
      onUpdateTeam(editingTeam);
      setEditingTeam(null);
    }
  };

  const startEditing = (team: Team) => {
    setEditingTeam(team);
  };

  return (
    <div className="space-y-6">
      {/* Create New Team Form */}
      <h4 className="mb-4 text-xl font-semibold text-gray-700">
        Create New Team
      </h4>
      <form
        onSubmit={handleCreateTeam}
        className="mb-8 rounded-md bg-gray-50 p-4"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Team Name"
                value={newTeam.team_name}
                onChange={e => {
                  setNewTeam({ ...newTeam, team_name: e.target.value });
                  setError(null);
                }}
                className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && error.includes("name")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Team Description"
                value={newTeam.team_description}
                onChange={e => {
                  setNewTeam({ ...newTeam, team_description: e.target.value });
                  setError(null);
                }}
                className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error && error.includes("description")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <button
              type="submit"
              className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
            >
              Create Team
            </button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>

      {/* Existing Teams Table */}
      <div className="mt-8">
        <h4 className="mb-4 text-xl font-semibold text-gray-700">
          Existing Teams
        </h4>
        <div className="overflow-x-auto rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Team Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th className="w-48 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center">
                    <span className="text-gray-500">
                      No teams available. Create a team to get started.
                    </span>
                  </td>
                </tr>
              ) : (
                teams.map(team => (
                  <tr key={team.team_id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {editingTeam && editingTeam.team_id === team.team_id ? (
                        <input
                          type="text"
                          value={editingTeam.team_name}
                          onChange={e =>
                            setEditingTeam({
                              ...editingTeam,
                              team_name: e.target.value
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-900">
                          {team.team_name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingTeam && editingTeam.team_id === team.team_id ? (
                        <input
                          type="text"
                          value={editingTeam.team_description}
                          onChange={e =>
                            setEditingTeam({
                              ...editingTeam,
                              team_description: e.target.value
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {team.team_description}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      {editingTeam && editingTeam.team_id === team.team_id ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={handleUpdateTeam}
                            className="rounded bg-green-500 px-3 py-1 font-bold text-white transition duration-300 hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTeam(null)}
                            className="rounded bg-gray-500 px-3 py-1 font-bold text-white transition duration-300 hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => startEditing(team)}
                            className="rounded bg-blue-500 px-3 py-1 font-bold text-white transition duration-300 hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteTeam(team.team_id)}
                            className="rounded bg-red-500 px-3 py-1 font-bold text-white transition duration-300 hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTeam;
