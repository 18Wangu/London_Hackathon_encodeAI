import React, { useState } from "react";
import { useEventStore } from "../stores/eventStore";
import UserAdd from "../components/UserAdd";
import EventCreate from "../components/EventCreate";
import EventList from "../components/EventList";

const PlanBuddies: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { users, events } = useEventStore();
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

  const handleCreateEvent = (userId: string) => {
    setSelectedUserId(userId);
    setShowCreateEvent(true);
  };

  const generateGroupDescription = async () => {
    try {
      setIsGeneratingDescription(true);
      
      const response = await fetch('http://localhost:6080/api/generate-group-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users, events }),
      });
      
      const data = await response.json();
      
      if (data.description) {
        setGeneratedDescription(data.description);
      }
    } catch (error) {
      console.error('Error generating group description:', error);
      alert('Failed to generate group description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <section className="max-w-6xl mx-auto">
        {/* En-tête centré en haut */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-center relative">
          {/* Décoration du drapeau français en haut */}
          <div className="absolute top-0 left-0 right-0 flex h-3">
            <div className="flex-1 bg-blue-700"></div>
            <div className="flex-1 bg-white"></div>
            <div className="flex-1 bg-red-600"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Les Frenchies 🌟</h1>
          <div className="flex justify-center mt-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/320px-Flag_of_France.svg.png" 
              alt="French Flag" 
              className="h-8 mx-1"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={generateGroupDescription}
              disabled={isGeneratingDescription}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
            >
              {isGeneratingDescription ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating description...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate a description with AI 🤖
                </>
              )}
            </button>
          </div>
          {generatedDescription && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description of the group ✨:</h3>
              <p className="text-gray-700">{generatedDescription}</p>
            </div>
          )}
        </div>

        {/* Mise en page en deux colonnes pour la suite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne de gauche - Add user et List of users */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add a <strong>user</strong> 👤</h2>
              <UserAdd />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">List of <strong>users</strong> 🧑‍🤝‍🧑</h2>
              {Object.values(users).length === 0 ? (
                <p className="text-gray-500">No users for the moment. Add one above!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(users).map((user) => (
                    <div 
                      key={user.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <span className="font-medium">{user.name}</span>
                      <button
                        onClick={() => handleCreateEvent(user.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create an event
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonne de droite - Liste des évènements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <EventList currentUserId={selectedUserId || Object.keys(users)[0] || ""} />
          </div>
        </div>
      </section>
      
      {/* Modal de création d'évènement */}
      {showCreateEvent && selectedUserId && (
        <EventCreate 
          userId={selectedUserId} 
          onClose={() => setShowCreateEvent(false)} 
        />
      )}
    </main>
  );
};

export default PlanBuddies;
