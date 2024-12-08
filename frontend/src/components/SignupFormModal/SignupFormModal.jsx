import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="signup-form-modal">
      <h1 className="signup-form-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="signup-form-label">
          Email
          <input
            type="text"
            className="signup-form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="signup-form-error">{errors.email}</p>}
        <label className="signup-form-label">
          Username
          <input
            type="text"
            className="signup-form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="signup-form-error">{errors.username}</p>}
        <label className="signup-form-label">
          First Name
          <input
            type="text"
            className="signup-form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="signup-form-error">{errors.firstName}</p>}
        <label className="signup-form-label">
          Last Name
          <input
            type="text"
            className="signup-form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="signup-form-error">{errors.lastName}</p>}
        <label className="signup-form-label">
          Password
          <input
            type="password"
            className="signup-form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="signup-form-error">{errors.password}</p>}
        <label className="signup-form-label">
          Confirm Password
          <input
            type="password"
            className="signup-form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-form-error">{errors.confirmPassword}</p>
        )}
        <button type="submit" className="signup-form-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;