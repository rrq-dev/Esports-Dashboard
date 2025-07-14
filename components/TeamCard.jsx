const TeamCard = ({ team }) => {
  return (
    <div className="border p-4 rounded shadow">
      <img
        src={team.logo}
        alt={team.name}
        className="w-24 h-24 object-contain mb-2"
      />
      <h2 className="text-xl font-semibold">{team.name}</h2>
      <p className="text-sm text-gray-600">{team.region}</p>
    </div>
  );
};

export default TeamCard;
