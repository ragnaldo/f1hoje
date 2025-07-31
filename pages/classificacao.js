import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ClassificationTable = ({ title, data, type }) => {
    const teamColorMap = {
        'Red Bull': 'bg-[#3671C6]', 'Ferrari': 'bg-[#F91536]', 'McLaren': 'bg-[#F58020]',
        'Mercedes': 'bg-[#6CD3BF]', 'Aston Martin': 'bg-[#358C75]', 'default': 'bg-gray-400'
    };
    return (
        <section>
            <h3 className="text-2xl font-bold text-[#15151e] mb-4 border-b-4 border-[#e10600] pb-2">{title}</h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left w-1/12">Pos</th>
                            <th className="p-3 text-left w-7/12">{type === 'driver' ? 'Piloto' : 'Equipe'}</th>
                            <th className="p-3 text-center w-2/12">Vit.</th>
                            <th className="p-3 text-right w-2/12">Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item.pos} className="border-b border-gray-200">
                                <td className="p-3 font-bold">{item.pos}</td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <span className={`w-1 h-6 ${teamColorMap[item.team] || teamColorMap.default} mr-3`}></span>
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">{item.wins}</td>
                                <td className="p-3 text-right font-bold">{item.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default function ClassificationPage({ drivers, constructors, pageContent }) {
  return (
    <div className="bg-[#f0f2f5] font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-[#15151e] mb-2">{pageContent.title}</h2>
          <p className="text-lg text-gray-600">{pageContent.subtitle}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <ClassificationTable title="Mundial de Pilotos" data={drivers} type="driver" />
          <ClassificationTable title="Mundial de Construtores" data={constructors} type="constructor" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const DRIVERS_API = "https://api.jolpi.ca/ergast/f1/current/driverStandings.json";
  const CONSTRUCTORS_API = "https://api.jolpi.ca/ergast/f1/current/constructorStandings.json";

  try {
    const [driversRes, constructorsRes] = await Promise.all([
      fetch(DRIVERS_API),
      fetch(CONSTRUCTORS_API),
    ]);
    const driversData = await driversRes.json();
    const constructorsData = await constructorsRes.json();

    const drivers = driversData.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(d => ({
      pos: d.position, name: `${d.Driver.givenName} ${d.Driver.familyName}`,
      team: d.Constructors[0].name, wins: d.wins, points: d.points,
    }));
    const constructors = constructorsData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(c => ({
      pos: c.position, name: c.Constructor.name, team: c.Constructor.name,
      wins: c.wins, points: c.points,
    }));

    return {
      props: {
        drivers, constructors,
        pageContent: {
          title: `Classificação do Campeonato ${new Date().getFullYear()}`,
          subtitle: "Pontuação atualizada após a última corrida.",
        },
      },
      revalidate: 900,
    };
  } catch (error) {
    return { props: { drivers: [], constructors: [], pageContent: {} } };
  }
}
