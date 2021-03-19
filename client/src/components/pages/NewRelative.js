import React, { useEffect, useState } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';
import { getTree } from '../../redux/relatives';
import { getRelatives } from '../../redux/relatives';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { DateField } from '../layout/forms/DateField';
const yup = require('yup');

const newRelativeSchema = yup.object().shape({
  first_name: yup.string().required('First name is required.'),
  last_name: yup.string().required('Last name is required.'),
  gender: yup.string().required('Gender is required.'),
  birthdate: yup.date().nullable(),
  deathdate: yup.date().nullable(),
});

const onSubmit = (values, { setSubmitting }) => {
  setTimeout(() => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  }, 400);
};

const FormField = ({ title, id, as, options, placeholder, className }) => (
  <div className={'form-field ' + className || ''}>
    {title}
    {as === 'date' ? (
      <DateField name={id} />
    ) : (
      <Field type='text' name={id} as={as || 'input'} placeholder={placeholder}>
        {options &&
          options.map((val) => (
            <option key={val.value} value={val.value}>
              {val.text}
            </option>
          ))}
      </Field>
    )}
    <div className='form-error'>
      <ErrorMessage name={id} component='div' className='form-error' />
    </div>
  </div>
);

const NewRelative = ({ match, user, relatives, getRelatives }) => {
  useEffect(() => {
    if (!user) loadUser();
    if (!relatives) getRelatives(match.params.treeId);
    //eslint-disable-next-line
  }, []);

  const [relationshipIndex, setRelationshipIndex] = useState(0);
  const [relationshipDivs, setRelationshipDivs] = useState([]);

  const RelationshipDiv = ({ index }) => (
    <div className='form-row'>
      <FormField
        title=''
        id={`relative_${index}`}
        as='select'
        options={[
          { value: null, text: 'n/a' },
          ...Object.values(relatives).map((x) => {
            return {
              value: x._id,
              text: `${x.first_name} ${x.last_name}`,
            };
          }),
        ]}
      />{' '}
      <FormField
        title=''
        id={`relationshipType_${index}`}
        as='select'
        className='w-25'
        options={[
          {
            value: 'parent',
            text: 'Parent',
          },
          {
            value: 'child',
            text: 'Child',
          },
          {
            value: 'spouse',
            text: 'Spouse',
          },
        ]}
      />
    </div>
  );

  return (
    <div className='w-100 h-100'>
      <Formik
        initialValues={{
          first_name: '',
          last_name: '',
          gender: 'male',
          birthdate: null,
          deathdate: null,
        }}
        validationSchema={newRelativeSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className='w-50 m-auto'>
            <div className='form-row'>
              <FormField title='First Name' id='first_name' />
              <FormField title='Last Name' id='last_name' />
            </div>
            <div className='form-row'>
              <FormField
                title='Gender'
                id='gender'
                as='select'
                options={[
                  { value: 'unspecified', text: 'Unspecified' },
                  { value: 'male', text: 'Male' },
                  { value: 'female', text: 'Female' },
                  { value: 'other', text: 'Other' },
                ]}
              />
            </div>
            <div className='form-row'>
              <FormField title='Birth Date' id='birthdate' as='date' />
              <FormField title='Death Date' id='deathdate' as='date' />
            </div>
            <div className='form-row'>
              <h3 className='form-row-header'>Relationships</h3>
              {relationshipDivs}
              <div className='form-row'>
                <button
                  onClick={() => {
                    setRelationshipDivs([
                      ...relationshipDivs,
                      <RelationshipDiv index={relationshipIndex} />,
                    ]);
                    setRelationshipIndex(relationshipIndex + 1);
                  }}
                >
                  add relative
                </button>
              </div>
            </div>

            <input
              type='submit'
              disabled={isSubmitting}
              value='Add Relative'
              className='btn btn-primary btn-block'
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  relatives: state.relatives.relatives,
});

const mapStateToDispatch = {
  loadUser,
  getRelatives,
};

export default connect(mapStateToProps, mapStateToDispatch)(NewRelative);
