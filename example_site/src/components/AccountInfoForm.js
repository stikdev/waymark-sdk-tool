import { useForm } from "react-hook-form";

export default function AccountInfoForm({
  account,
  formTitle,
  onSubmit,
  shouldRequirePrivateKey,
  submitButtonText,
}) {
  const { register, handleSubmit } = useForm();

  return (
    <form data-test="createAccount-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>{formTitle}</h2>

      {shouldRequirePrivateKey ? (
        <>
          <label className="form-label" htmlFor="createAccountPrivateKey">
            Partner secret
          </label>
          <input
            type="text"
            className="form-input"
            id="createAccountPrivateKey"
            name="privateKey"
            defaultValue="test-secret"
            ref={register({ required: true })}
          />
        </>
      ) : null}

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
      />

      <label className="form-label" htmlFor="createAccountEmailAddress">
        Email Address*
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountEmailAddress"
        name="emailAddress"
        defaultValue={account ? account.emailAddress : null}
        ref={register}
      />

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
      />

      <label className="form-label" htmlFor="createAccountPhone">
        Phone Number
      </label>
      <input
        type="text"
        className="form-input"
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
        className="form-input"
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
        className="form-input"
        id="createAccountState"
        name="state"
        placeholder="State abbreviation, e.g. MI or FL"
        defaultValue={account ? account.state : null}
        ref={register({ maxLength: 2 })}
      />

      <label className="form-label" htmlFor="createAccountExternalID">
        External ID*
      </label>
      <input
        type="text"
        className="form-input"
        id="createAccountExternalID"
        name="externalID"
        defaultValue={account ? account.externalID : null}
        ref={register}
      />

      <button className="submit-button" data-test="createAccount-button">
        {submitButtonText}
      </button>
    </form>
  );
}
