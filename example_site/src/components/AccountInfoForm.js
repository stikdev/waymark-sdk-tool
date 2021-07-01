import { useForm } from "react-hook-form";
import React, { useState } from "react";

import { useAppContext } from "./AppProvider";

export default function AccountInfoForm({
  account,
  updateAccount,
  formTitle,
  subtitle,
  submitButtonText,
  canUpdate,
}) {
  const { openSnackbar } = useAppContext();
  const { register, handleSubmit } = useForm();
  const [buttonStatus, setButtonStatus] = useState(true);

  const handleOnChange = (e) => {
    setButtonStatus(false);
    console.log("handleOnChange called");
  }
  
  const handleSave = (e) => {
    setButtonStatus(true);
    console.log("handleSave called");
    updateAccount(e);
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
        className="form-input"
        id="createAccountEmailAddress"
        name="emailAddress"
        defaultValue={account ? account.emailAddress : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountExternalID">
        External ID
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountExternalID"
        name="externalID"
        defaultValue={account ? account.externalID : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountFirstName">
        First Name
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountFirstName"
        name="firstName"
        defaultValue={account ? account.firstName : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountLastName">
        Last Name
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountLastName"
        name="lastName"
        defaultValue={account ? account.lastName : null}
        ref={register}
        onChange={handleOnChange}
      />
      {console.log("Last name change status", buttonStatus)}

      <label className="form-label" htmlFor="createAccountCompanyName">
        Company Name
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountCompanyName"
        name="companyName"
        defaultValue={account ? account.companyName : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountPhone">
        Phone
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountPhone"
        name="phone"
        defaultValue={account ? account.phone : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountCity">
        City
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountCity"
        name="city"
        defaultValue={account ? account.city : null}
        ref={register}
        onChange={handleOnChange}
      />

      <label className="form-label" htmlFor="createAccountState">
        State
      </label>
      <input
        type="text"
        className="form-input"
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
        onChange={handleOnChange}
      />

      {console.log("Button status", buttonStatus)}

      {canUpdate ? (
        <>
          <button 
            className="submit-button form-button" 
            data-test="createAccount-button"
            disabled={buttonStatus}
          >
            {submitButtonText}
          </button>
        </>
      ) : (
        <>
          <button className="submit-button form-button" data-test="createAccount-button">
            {submitButtonText}
          </button>
        </>
        )
      }
      
    </form>
  );
}
