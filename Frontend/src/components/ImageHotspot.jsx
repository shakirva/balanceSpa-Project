import PropTypes from 'prop-types';

const ImageHotspot = ({ 
  src, 
  hotspots, 
  selected = [], 
  onChange
}) => {
  const handleHotspotClick = (id, e) => {
    e.stopPropagation();
    onChange(
      selected.includes(id)
        ? selected.filter(item => item !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="relative w-full h-full">
      <img 
        src={src} 
        alt="Body" 
        className="w-full h-full object-contain" 
        draggable="false"
      />
      
      {hotspots.map(({ id, x, y, label }) => (
        <button
          key={id}
          type="button"
          className={`absolute w-6 h-6 rounded-full flex items-center justify-center transition-all
            ${selected.includes(id) 
              ? 'bg-blue-500 border-2 border-white shadow-lg scale-110' 
              : 'bg-red-500/90 border-2 border-white/80 hover:scale-105'}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={(e) => handleHotspotClick(id, e)}
          aria-label={`Select ${label}`}
        >
          <span className="text-white text-xs font-bold">
            {selected.includes(id) ? '✓' : '+'}
          </span>
        </button>
      ))}
    </div>
  );
};

ImageHotspot.propTypes = {
  src: PropTypes.string.isRequired,
  hotspots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      label: PropTypes.string
    })
  ).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired
};

export default ImageHotspot;