import React from 'react';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';

const ProductTeamSection = ({ team }) => {
  if (!team) return null;

  return (
    <ProductSpecs title="🏆 Équipe cycliste" className="team-section">
      <ProductSpecItem 
        label="Équipe"
        fullWidth={false}
      >
        <span className="team-name">
          {team.name}
          {team.isWorldTour && (
            <span className="world-tour-badge">🌍 World Tour</span>
          )}
        </span>
      </ProductSpecItem>
      {team.description && (
        <ProductSpecItem 
          label="À propos" 
          value={team.description}
          fullWidth={true}
        />
      )}
    </ProductSpecs>
  );
};

export default ProductTeamSection;

