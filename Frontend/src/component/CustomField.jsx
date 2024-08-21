import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import { useState } from 'react';

const CustomField = ({ label, type, options, ...props }) => { 
  const [isPasswordHide, setIsPasswordHide] = useState(type === "password");
  if (type === 'radio') {
    return (
      <div className="relative z-0 w-full group">
        <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>
        <div className='flex flex-col'>
        {options.map((option) => (
          <label key={option.value} className="items-center mr-2">
            <Field
              type="radio"
              name={props.name}
              value={option.value}
              className="mr-2"
            />
            {option.label}
          </label>
        ))}
        </div>
        <ErrorMessage name={props.name} component="div" className="text-red-500 text-xs mt-1" />
      </div>
    );
  }

  return (
    <div className="relative z-0 w-full mb-5 group">
      <Field
      type={type === "password" ? (isPasswordHide ? "password" : "text") : type}
        {...props}
        className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer "
        placeholder={label}
      />
      {type === "password" && (
          <button
            type="button"
            onClick={()=>setIsPasswordHide(!isPasswordHide)}
            className="absolute right-2 top-2"
          >
            {isPasswordHide ? (
              <i className="fa-solid fa-eye-slash"></i> 
            ) : (
              <i className="fa-solid fa-eye"></i> 
            )}
          </button>
        )}
      
      <ErrorMessage name={props.name} component="div" className="text-red-500 text-xs mt-1" />
    </div>
  );
};

CustomField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

export default CustomField;
