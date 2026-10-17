import { useState } from "react";
import { submitAuthAction } from "../utils/authActions";
import { AUTH_INITIAL_FORM, LOGIN } from "../constants/LOGIN";

const useAuthFlow = ({
  mode,
  service,
  onLoginSuccess,
}) => {
  const [form, setForm] = useState(AUTH_INITIAL_FORM);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionComplete, setActionComplete] = useState(false);

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setForm(AUTH_INITIAL_FORM);
    setMessage("");
    setError("");
    setActionComplete(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await submitAuthAction({ mode, form, service });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.loginResponse) {
        onLoginSuccess(result.loginResponse);
        return;
      }

      setMessage(result.message);
      setActionComplete(result.actionComplete);
    } catch (requestError) {
      setError(
        requestError.response?.data?.error ||
          LOGIN.ERRORS.request,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    message,
    error,
    loading,
    actionComplete,
    onFieldChange,
    resetForm,
    onSubmit,
  };
};

export default useAuthFlow;
