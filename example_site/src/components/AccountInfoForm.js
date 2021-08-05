import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import _ from 'lodash';

import { useAppContext } from "./AppProvider";

export default function AccountInfoForm({
  account,
  onFormSubmit,
  formTitle,
  subtitle,
  submitButtonText,
  requireInputChange,
}) {
  const { openSnackbar } = useAppContext();
  const { register, handleSubmit, watch } = useForm();
  const [isButtonDisabled, setIsButtonDisabled] = useState(requireInputChange);
  const watchFields = watch();

  useEffect(() => {
    if (!_.isEmpty(watchFields)) {
      setIsButtonDisabled(false);
    }
    else {
      setIsButtonDisabled(true);
    }
  }, [watchFields, watchFields.city, watchFields.companyName, watchFields.emailAddress,
    watchFields.externalID, watchFields.firstName, watchFields.lastName,
    watchFields.phone, watchFields.state])
 
  const handleSave = (e) => {
    setIsButtonDisabled(true);
    onFormSubmit(e);
  }  

  const onFormSubmitError = (errors) => {
    console.log("Error submitting form: ", errors);

    openSnackbar(
      `Please fix the following errors:\n${Object.values(errors)
        .map((error) => error.message)
        .join("\n")}`
    );
  };

  return (
    <form
      data-test="createAccount-form"
      onSubmit={handleSubmit(handleSave, onFormSubmitError)}
    >
      <h2>{formTitle}</h2>
      {subtitle ? (
        <p>
          {subtitle}
        </p>
      ) : null}

      <label className="form-label" htmlFor="createAccountEmailAddress">
        Email
      </label>
      <input
        type="text"  
        id="createAccountEmailAddress"
        name="emailAddress"
        defaultValue={account ? account.emailAddress : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountExternalID">
        External ID
      </label>
      <input
        type="text"  
        id="createAccountExternalID"
        name="externalID"
        defaultValue={account ? account.externalID : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountFirstName">
        First Name
      </label>
      <input
        type="text" 
        id="createAccountFirstName"
        name="firstName"
        defaultValue={account ? account.firstName : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountLastName">
        Last Name
      </label>
      <input
        type="text" 
        id="createAccountLastName"
        name="lastName"
        defaultValue={account ? account.lastName : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountCompanyName">
        Company Name
      </label>
      <input
        type="text" 
        id="createAccountCompanyName"
        name="companyName"
        defaultValue={account ? account.companyName : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountPhone">
        Phone
      </label>
      <input
        type="text" 
        id="createAccountPhone"
        name="phone"
        defaultValue={account ? account.phone : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountCity">
        City
      </label>
      <input
        type="text" 
        id="createAccountCity"
        name="city"
        defaultValue={account ? account.city : null}
        ref={register}
      />

      <label className="form-label" htmlFor="createAccountState">
        State
      </label>
      <input
        type="text" 
        id="createAccountState"
        name="state"
        placeholder="State abbreviation, e.g. MI or FL"
        defaultValue={account ? account.state : null}
        ref={register({
          maxLength: {
            value: 2,
            message: "State should be a two-letter abreviation.",
          },
        })}
      />

      <button 
        className="submit-button form-button" 
        data-test="createAccount-button"
        disabled={requireInputChange ? isButtonDisabled : false}
      >
        {submitButtonText}
      </button>      
    </form>
  );
}
