import React, { useState } from "react";
import { Role } from "../../utils/api/endpoints/team/teamManagement";

interface SendInvitationProps {
  onSendInvitation: (email: string, team_role_id: number) => Promise<void>;
  roles: Role[];
}

const SendInvitation: React.FC<SendInvitationProps> = ({
  onSendInvitation,
  roles
}) => {
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email === "") {
      setError("Please enter an email address");
      return;
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (selectedRoleId === "") {
      setError("Please select a role");
      return;
    }

    if (typeof selectedRoleId === "number") {
      setIsLoading(true);
      try {
        await onSendInvitation(email, selectedRoleId);
        setEmail("");
        setSelectedRoleId("");
      } catch (error) {
        console.error("Error sending invitation:", error);
        setError("Failed to send invitation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <form onSubmit={handleSendInvitation} className="space-y-4">
        <div className="flex items-end space-x-4">
          <div className="flex-grow">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              placeholder="Enter email address"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError(null);
              }}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error && error.includes("email")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          </div>
          <div className="flex-grow">
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              value={selectedRoleId}
              onChange={e => {
                setSelectedRoleId(Number(e.target.value));
                setError(null);
              }}
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error && error.includes("role")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default SendInvitation;
