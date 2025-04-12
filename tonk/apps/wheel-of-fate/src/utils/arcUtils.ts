// src/utils/arcUtils.ts
export const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ): { x: number; y: number } => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };
  
  export const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
  
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
    const d = [
      `M ${x} ${y}`, // Début au centre
      `L ${start.x} ${start.y}`, // Ligne vers le début de l'arc
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, // Arc
      "Z", // Fermer le chemin
    ].join(" ");
  
    return d;
  };
  