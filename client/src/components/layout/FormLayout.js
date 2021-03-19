import React, { useContext } from 'react';

const FormField = ({ title, id, as, options }) => (
  <div className='form-field'>
    {title}
    <Field type='text' name={id} as={as || 'input'}>
      {options &&
        Object.keys(options).map((val) => (
          <options value={val}>{options[val]}</options>
        ))}
    </Field>
    <div className='form-error'>
      <ErrorMessage name={id} component='div' className='form-error' />
    </div>
  </div>
);

const FormLayout = ({ form }) => {
  return (
    <div>
      {form.map((row) => (
        <div className='form-row'>
          {row.map((field) =>
            typeof field === 'string' ? (
              <h2 className='form-row-header'>{field}</h2>
            ) : (
              <FormField {...field} />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default FormLayout;
