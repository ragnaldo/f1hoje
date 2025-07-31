import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FeaturedRaceCard = ({ race, type }) => {
    if (!race) return null;
    const title = type === 'previous' ? 'Corrida Anterior' : (type === 'next' ? 'Próxima Corrida' : 'Corrida Seguinte');
    const cardClass = `race-card flex flex-col bg-white rounded-lg shadow-lg p-5 h-full transition-transform transform hover:-translate-y-1 ${type === 'next' ? 'border-2 border-[#e10600] ring-4 ring-red-100' : ''}`;

    return (
        <div className={cardClass}>
            <p className="font-bold text-[#e10600]">{title}</p>
            <h3 className="text-2xl font-bold text-[#15151e] mt-1">{race.name}</h3>
            <p className="text-gray-600 mb-4">{race.circuit}</p>
            <div className="mt-auto bg-gray-50 p-3 rounded-md">
                {type === 'previous' && race.podium ? (
                    <>
                        <h4 className="font-bold text-lg mb-2">Pódio</h4>
                        <ol className="list-decimal list-inside text-gray-700">
                            <li>{race.podium.p1}</li>
                        </ol>
                    </>
                ) : (
                    <>
                        <h4 className="font-bold text-lg mb-2">Data da Corrida</h4>
                        <p className="text-gray-700">{new Date(race.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}</p>
                    </>
                )}
            </div>
        </div>
    );
};

const FullCalendar = ({ allRaces, isOpen }) => (
    <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1500px]' : 'max-h-0'}`}>
        <div className="bg-white rounded-b-lg shadow-md -mt-1 p-4 md:p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            {allRaces.map(race => (
                <div key={race.round} className="flex items-center border-b border-gray-100 py-2">
                    <span className="text-[#e10600] font-bold w-8">{race.round}.</span>
                    <span>{race.name} - {new Date(race.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', timeZone: 'UTC' })}</span>
                </div>
            ))}
        </div>
    </div>
);

export default function CalendarPage({ featuredRaces, allRaces, pageContent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#f0f2f5] font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-[#15151e] mb-2">{pageContent.title}</h2>
          <p className="text-lg text-gray-600">{pageContent.subtitle}</p>
        </div>
        {featuredRaces && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <FeaturedRaceCard race={featuredRaces.previous} type="previous" />
            <FeaturedRaceCard race={featuredRaces.next} type="next" />
            <FeaturedRaceCard race={featuredRaces.following} type="following" />
          </div>
        )}
        <div onClick={() => setIsOpen(!isOpen)} className={`bg-white rounded-lg shadow-md p-4 flex justify-between items-center cursor-pointer hover:shadow-lg transition-shadow ${isOpen ? 'rounded-b-none' : ''}`}>
          <h3 className="text-xl font-bold text-[#15151e]">Ver calendário completo</h3>
          <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </div>
        <FullCalendar allRaces={allRaces} isOpen={isOpen} />
      </main>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  const CURRENT_YEAR = new Date().getFullYear();
  const F1_CALENDAR_API = `https://api.jolpi.ca/ergast/f1/${CURRENT_YEAR}.json`;
  const F1_RESULTS_API = `https://api.jolpi.ca/ergast/f1/${CURRENT_YEAR}/results/1.json`;

  try {
    const [calendarRes, resultsRes] = await Promise.all([
        fetch(F1_CALENDAR_API),
        fetch(F1_RESULTS_API)
    ]);
    const calendarData = await calendarRes.json();
    const resultsData = await resultsRes.json();

    const allRaces = calendarData.MRData.RaceTable.Races.map(race => {
        const result = resultsData.MRData.RaceTable.Races.find(r => r.round === race.round);
        return {
            round: race.round, name: race.raceName, circuit: race.Circuit.circuitName,
            date: race.date, podium: result ? { p1: result.Results[0].Driver.code } : null,
        };
    });

    const today = new Date();
    let nextRaceIndex = allRaces.findIndex(race => new Date(race.date) >= today);
    if (nextRaceIndex === -1) nextRaceIndex = allRaces.length - 1;
    
    const featuredRaces = {
        previous: allRaces[nextRaceIndex > 0 ? nextRaceIndex - 1 : 0],
        next: allRaces[nextRaceIndex],
        following: allRaces[nextRaceIndex < allRaces.length - 1 ? nextRaceIndex + 1 : nextRaceIndex]
    };

    return {
      props: {
        allRaces, featuredRaces,
        pageContent: {
          title: `Calendário Oficial da Fórmula 1 ${CURRENT_YEAR}`,
          subtitle: "A corrida anterior, a próxima e a seguinte em destaque.",
        },
      },
      revalidate: 3600,
    };
  } catch (error) {
    return { props: { allRaces: [], featuredRaces: null, pageContent: {} } };
  }
}
