// src/components/EventDetails.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useWheelStore, Event } from "../stores/wheelStore";
import EventItems from "./EventItems";

type RouteParams = {
  eventId: string;
};

const EventDetails: React.FC = () => {
  const { eventId } = useParams<RouteParams>();
  const { events, users } = useWheelStore();
  const event: Event | undefined = events[eventId];

  // Gestion des erreurs : identifiant absent ou évènement non trouvé
  if (!eventId) {
    return (
      <div className="p-6">
        <h2 className="text-2xl text-gray-900">Erreur</h2>
        <p className="text-gray-600">L'identifiant de l'évènement est manquant.</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <h2 className="text-2xl text-gray-900">Évènement introuvable</h2>
        <p className="text-gray-600">L'évènement demandé n'existe pas.</p>
      </div>
    );
  }

  // Extraction des participants depuis event.responses (seulement ceux ayant répondu "going")
  const participants = event.responses
    ? event.responses
        .filter((response) => response.response === "going")
        .map((response) => users[response.userId])
        .filter((user) => user !== undefined)
    : [];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <section className="max-w-6xl mx-auto">
        {/* En-tête décoré de l'évènement */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center relative">
          {/* Décoration de la bannière (similaire à PlanBuddies) */}
          <div className="absolute top-0 left-0 right-0 flex h-3">
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{event.title}</h1>
          <p className="text-gray-700 mt-2">{event.description}</p>
          <p className="text-gray-500 mt-2">
            <span className="font-medium">Location:</span> {event.location}
          </p>
          <p className="text-gray-500 mt-2">
            <span className="font-medium">Date:</span> {event.date}
          </p>
        </div>

        {/* Liste des participants */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Participants
          </h2>
          {participants.length === 0 ? (
            <p className="text-gray-500 text-center">
              Aucun participant pour cet évènement.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {participants.map((user) => (
                <li
                  key={user.id}
                  className="p-4 border border-gray-200 rounded-lg flex items-center space-x-4 hover:shadow-md transition-shadow"
                >
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <span className="font-medium text-blue-600 uppercase">
                    {user.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Affichage des items liés à l'évènement */}
        <EventItems eventId={event.id} />
      </section>
    </main>
  );
};

export default EventDetails;
