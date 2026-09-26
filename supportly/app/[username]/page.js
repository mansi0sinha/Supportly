import React from "react";

const Username = async ({ params }) => {
  const { username } = await params;

  return (
    <div className="text-white">
      <h1>Welcome</h1>
      <p>{username}</p>
    </div>
  );
};

export default Username;