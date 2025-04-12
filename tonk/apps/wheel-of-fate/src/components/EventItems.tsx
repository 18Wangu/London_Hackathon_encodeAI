// src/components/EventItems.tsx
import React, { useState } from "react";
import { useWheelStore } from "../stores/wheelStore";
import SpinWheelModal from "./SpinWheelModal";

type Item = {
  id: string;
  name: string;
};

type Props = {
  eventId: string;
};

const EventItems: React.FC<Props> = ({ eventId }) => {
  const { events, users, balances } = useWheelStore();
  const event = events[eventId];

  // Pour filtrer les participants ayant répondu "going"
  const participants = event?.responses
    ? event.responses
        .filter((response) => response.response === "going")
        .map((response) => users[response.userId])
        .filter((user) => user !== undefined)
    : [];

  // Etat pour gérer l'ouverture de la popup de la roue
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const openSpinWheel = (item: Item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeSpinWheel = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  if (!event) return null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Items</h2>
        {event.items.length === 0 ? (
          <p className="text-gray-500">Aucun item pour cet évènement.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.items.map((item) => (
              <li
                key={item.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openSpinWheel(item)}
              >
                <span className="text-lg font-bold text-blue-600 uppercase">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && selectedItem && (
        <SpinWheelModal
          item={selectedItem}
          participants={participants}
          balances={balances}
          onClose={closeSpinWheel}
        />
      )}
    </>
  );
};

export default EventItems;
