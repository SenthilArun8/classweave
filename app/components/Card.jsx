const Card = ({ children, bg = 'bg-gray-100', className = '', ...props }) => {
  return (
    <div 
      className={`${bg} p-6 rounded-lg shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
