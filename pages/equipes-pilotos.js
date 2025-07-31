import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TeamCard = ({ team }) => (
  <div className={`bg-white rounded-lg shadow-xl overflow-hidden border-t-8 ${team.borderColor}`}>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#15151e]">{team.name}</h3>
    </div>
    <div className="grid grid-cols-2 gap-px bg-gray-200">
      {team.drivers.map(driver => (
        <div key={driver.number} className="bg-white p-4 text-center">
          <img src={`https://placehold.co/200x200/cccccc/000000?text=${driver.code}`} alt={driver.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200" />
          <p className="font-bold text-lg">{driver.name}</p>
          <p className={`font-black text-3xl ${team.textColor}`}>{driver.number}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function TeamsAndDriversPage({ teams, pageContent }) {
  return (
    <div className="bg-[#f0f2f5] font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-[#15151e] mb-2">{pageContent.title}</h2>
          <p className="text-lg text-gray-600">{pageContent.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {teams.map(team => <TeamCard key={team.id} team={team} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const F1_DRIVERS_API = "https://api.jolpi.ca/ergast/f1/current/driverStandings.json";
  const teamColorMap = {
      'ferrari': { border: 'border-[#F91536]', text: 'text-[#F91536]' },
      'mercedes': { border: 'border-[#6CD3BF]', text: 'text-[#6CD3BF]' },
      'mclaren': { border: 'border-[#F58020]', text: 'text-[#F58020]' },
      'red_bull': { border: 'border-[#3671C6]', text: 'text-[#3671C6]' },
      'alpine': { border: 'border-[#2293D1]', text: 'text-[#2293D1]' },
      'williams': { border: 'border-[#37BEDD]', text: 'text-[#37BEDD]' },
      'haas': { border: 'border-[#B6BABD]', text: 'text-[#B6BABD]' },
      'sauber': { border: 'border-[#52E252]', text: 'text-[#52E252]' },
      'rb': { border: 'border-[#6692FF]', text: 'text-[#6692FF]' },
      'aston_martin': { border: 'border-[#358C75]', text: 'text-[#358C75]' },
      'default': { border: 'border-gray-400', text: 'text-gray-600' }
  };

  try {
    const res = await fetch(F1_DRIVERS_API);
    const data = await res.json();
    const driverStandings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    const teamsMap = new Map();
    driverStandings.forEach(driverInfo => {
      const constructor = driverInfo.Constructors[0];
      const teamId = constructor.constructorId;
      if (!teamsMap.has(teamId)) {
        const colors = teamColorMap[teamId] || teamColorMap.default;
        teamsMap.set(teamId, {
          id: teamId, name: constructor.name, drivers: [],
          borderColor: colors.border, textColor: colors.text,
        });
      }
      teamsMap.get(teamId).drivers.push({
        name: `${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName}`,
        number: driverInfo.Driver.permanentNumber || driverInfo.Driver.code,
        code: driverInfo.Driver.code,
      });
    });

    return {
      props: {
        teams: Array.from(teamsMap.values()),
        pageContent: {
          title: `Equipas e Pilotos ${new Date().getFullYear()}`,
          subtitle: "Conheça o grid completo da temporada.",
        },
      },
      revalidate: 86400,
    };
  } catch (error) {
    return { props: { teams: [], pageContent: {} } };
  }
}
