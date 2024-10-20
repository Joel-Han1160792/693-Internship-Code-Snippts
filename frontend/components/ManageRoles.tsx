import React, { useState } from "react";

interface Role {
  role_id: string;
  role_name: string;
}

interface ManageRolesProps {
  roles: Role[];
  onAddRole: (role: Omit<Role, "role_id">) => void;
  onDeleteRole: (roleId: string) => void;
}

const ManageRoles: React.FC<ManageRolesProps> = ({
  roles,
  onAddRole,
  onDeleteRole
}) => {
  const [newRole, setNewRole] = useState<Omit<Role, "role_id">>({
    role_name: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRole.role_name.trim() === "") {
      setError("Role name is required");
      return;
    }
    onAddRole(newRole);
    setNewRole({ role_name: "" });
    setError(null);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h4 className="mb-4 text-xl font-semibold text-gray-700">
        Create New Role
      </h4>
      <form onSubmit={handleAddRole} className="mb-8 rounded-md bg-gray-50 p-4">
        <div className="flex items-start space-x-2">
          <div className="flex-grow">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole.role_name}
                onChange={e => {
                  setNewRole({ ...newRole, role_name: e.target.value });
                  setError(null);
                }}
                className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="submit"
                className="ml-2 whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
              >
                Add Role
              </button>
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </form>

      <h4 className="mb-4 text-xl font-semibold text-gray-700">
        Existing Roles
      </h4>
      <ul className="space-y-4">
        {/* Ensure roles is an array before calling map */}
        {Array.isArray(roles) && roles.length > 0 ? (
          roles.map(role => (
            <li
              key={role.role_id}
              className="flex items-center justify-between rounded-md bg-gray-50 p-4 shadow-sm"
            >
              <span className="font-bold text-gray-800">{role.role_name}</span>
              <button
                onClick={() => onDeleteRole(role.role_id)}
                className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
              >
                Delete Role
              </button>
            </li>
          ))
        ) : (
          <p>No roles available</p>
        )}
      </ul>
    </div>
  );
};

export default ManageRoles;
