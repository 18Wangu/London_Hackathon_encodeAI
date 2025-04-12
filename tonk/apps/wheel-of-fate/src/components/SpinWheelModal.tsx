// src/components/SpinWheelModal.tsx
import React, { useState } from "react";
import { polarToCartesian, describeArc } from "../utils/arcUtils";

type User = {
  id: string;
  name: string;
  avatar?: string;
};

type Item = {
  id: string;
  name: string;
};

type Props = {
  item: Item;
  participants: User[];
  // balances: objet avec clé userId et structure comprenant "owes" et "isOwed"
  balances: Record<
    string,
    { owes: Record<string, number>; isOwed: Record<string, number> }
  >;
  onClose: () => void;
};

const computeWeight = (userId: string, balances: Props["balances"]) => {
  const balance = balances[userId];
  if (!balance) return 1;
  const totalOwes = Object.values(balance.owes).reduce((acc, cur) => acc + cur, 0);
  const totalIsOwed = Object.values(balance.isOwed).reduce((acc, cur) => acc + cur, 0);
  const net = totalOwes - totalIsOwed;
  return net > 0 ? net : 1;
};

const weightedRandomSelect = (participants: User[], weights: number[]) => {
  const totalWeight = weights.reduce((acc, cur) => acc + cur, 0);
  const random = Math.random() * totalWeight;
  let cumulative = 0;
  for (let i = 0; i < participants.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) return participants[i];
  }
  return participants[participants.length - 1];
};

const SpinWheelModal: React.FC<Props> = ({ item, participants, balances, onClose }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<User | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  // Calcul des poids et total
  const weights = participants.map((user) => computeWeight(user.id, balances));
  const totalWeight = weights.reduce((acc, cur) => acc + cur, 0);

  // Calcul des secteurs de la roue en fonction des poids
  let currentAngle = 0;
  const sectors = participants.map((participant, index) => {
    const sliceAngle = (weights[index] / totalWeight) * 360;
    const sector = {
      participant,
      startAngle: currentAngle,
      endAngle: currentAngle + sliceAngle,
    };
    currentAngle += sliceAngle;
    return sector;
  });

  // Nouvelle palette de couleurs pour la roue
  const colors = ["#7f1d1d", "#dc2626", "#1d4ed8", "#1e3a8a", "#FFFFFF"];

  const spinDuration = 2000; // durée de l'animation en ms

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Sélection pondérée du gagnant
    const selected = weightedRandomSelect(participants, weights);

    // Trouver le secteur correspondant au gagnant et calculer son angle médian
    const winnerSector = sectors.find(
      (sector) => sector.participant.id === selected.id
    );
    const winnerMidAngle =
      winnerSector !== undefined
        ? (winnerSector.startAngle + winnerSector.endAngle) / 2
        : 0;

    // Pour que le secteur gagnant se retrouve en haut (0°), on calcule l'angle de rotation
    const additionalFullSpins = Math.floor(Math.random() * 2) + 3; // entre 3 et 4 rotations complètes
    const finalRotation = additionalFullSpins * 360 + (360 - winnerMidAngle);

    setRotation(finalRotation);

    // Attendre la fin de l'animation puis afficher le gagnant
    setTimeout(() => {
      setWinner(selected);
      setIsSpinning(false);
    }, spinDuration);
  };

  // Paramètres du SVG pour une roue plus grande
  const radius = 140;
  const center = { x: 150, y: 150 };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {/* Popup agrandie avec fond clair */}
      <div className="bg-gray-50 rounded-lg shadow-lg p-8 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          X
        </button>
        <h2 className="text-3xl font-bold text-blue-600 text-center mb-6 uppercase">
          {item.name}
        </h2>

        <div className="relative mx-auto" style={{ width: 300, height: 300 }}>
          {/* Marqueur en haut : image de joint (fixe) */}
          <img
            src="/icons/weed-removebg-preview.png"
            alt="Joint"
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 z-10 rotate-90"
          />

          {/* SVG de la roue qui tourne */}
          <svg
            width="300"
            height="300"
            className="block mx-auto"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: `transform ${spinDuration}ms ease-out`,
            }}
          >
            {sectors.map((sector, idx) => (
              <g key={sector.participant.id}>
                <path
                  d={describeArc(
                    center.x,
                    center.y,
                    radius,
                    sector.startAngle,
                    sector.endAngle
                  )}
                  fill={colors[idx % colors.length]}
                />
                {/* Positionnement du nom dans le secteur */}
                {(() => {
                  const midAngle = (sector.startAngle + sector.endAngle) / 2;
                  const midRadians = ((midAngle - 90) * Math.PI) / 180;
                  const textRadius = radius / 1.5;
                  const x = center.x + textRadius * Math.cos(midRadians);
                  const y = center.y + textRadius * Math.sin(midRadians);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#fff"
                      fontSize="12"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {sector.participant.name}
                    </text>
                  );
                })()}
              </g>
            ))}
            <image
              href="/icons/harry-removebg-preview.png"
              x={center.x - 50}
              y={center.y - 50}
              width="100"
              height="100"
              clipPath="circle(50px at 50px 50px)"
            />
          </svg>
        </div>

        {winner && (
          <div className="text-center mt-6">
            {winner.avatar && (
              <img
                src={winner.avatar}
                alt={winner.name}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
            )}
            <p className="text-2xl font-bold text-red-600 uppercase">
              {winner.name}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={spinWheel}
            disabled={isSpinning}
            className="px-6 py-3 bg-red-600 text-white text-lg rounded hover:bg-red-700 transition"
          >
            {isSpinning ? "En cours..." : "Tourner la roue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpinWheelModal;
