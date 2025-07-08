import React from "react";

interface Member {
  id: number;
  name: string;
  age: number;
  occupation: string;
  savings: number;
}

interface MemberTableProps {
  selectedSHG: string;
  shgMembers: Member[];
}

export default function MemberTable({
  selectedSHG,
  shgMembers,
}: MemberTableProps) {
  return (
    <section>
      <h3 className="mb-4 text-neutral-500">
        <span>Members of </span>
        <span>{selectedSHG}</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-solid border-collapse border-zinc-300">
          <thead>
            <tr className="bg-stone-50">
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Sr No.
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Name
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Age
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Occupation
              </th>
              <th className="p-2 text-sm text-left border border-solid border-zinc-300 text-neutral-500">
                Savings (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {shgMembers?.map((member, index) => (
              <tr
                key={member.id}
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? "rgb(255, 255, 255)"
                      : "rgb(249, 249, 249)",
                }}
              >
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {index + 1}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {member.name}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {member.age}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {member.occupation}
                </td>
                <td className="p-2 text-sm border border-solid border-zinc-300">
                  {member.savings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
