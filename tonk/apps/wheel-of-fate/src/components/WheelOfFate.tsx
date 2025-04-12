import React from "react";
import { Link } from "react-router-dom";
import { useWheelStore } from "../stores/wheelStore";

const WheelOfFate: React.FC = () => {
  // Récupérer les évènements depuis le store
  const { events } = useWheelStore();
  const eventList = Object.values(events);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <section className="max-w-6xl mx-auto">
        {/* En-tête centré */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center relative">
          <div className="absolute top-0 left-0 right-0 flex h-3">
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">The Frenchies</h1>
          <div className="flex justify-center mt-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/320px-Flag_of_France.svg.png" 
              alt="French Flag" 
              className="h-8 mx-1"
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-gray-900">Choose an Event</h3>
            <p className="text-gray-700 mt-1">
              Select an event to spin the wheel and decide who brings what!
            </p>
          </div>
        </div>

        {/* Affichage de la liste des évènements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Events</h2>
          {eventList.length === 0 ? (
            <p className="text-gray-500">No events available. Please add one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventList.map((event) => (
                <Link 
                  key={event.id} 
                  to={`/event/${event.id}`} // Redirige vers la page détail de l'évènement
                  className="block"
                >
                  <div className="relative bg-gray-100 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg"></div>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-blue-600 uppercase">{event.title}</h3>
                      <p className="text-gray-700 text-sm mt-1">{event.description}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        Location: <span className="font-medium text-gray-900">{event.location}</span>
                      </p>
                      <p className="text-gray-500 text-xs">
                        Date: <span className="font-medium text-gray-900">{event.date}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default WheelOfFate;
