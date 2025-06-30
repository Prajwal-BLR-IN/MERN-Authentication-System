import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRef, useState } from "react";
import * as Yup from 'yup';
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";

type InitialValueType = {
  name?: string;
  email: string;
  password: string;
};

const Login = () => {
  const {backendUrl, setIsLoggedin, getUserData} = useAppContext();
  const [state, setState] = useState<'sign-up' | 'login'>('sign-up');
  const tree1Ref = useRef<HTMLImageElement | null>(null);
  const tree2Ref = useRef<HTMLImageElement | null>(null);
  const navigate = useNavigate();

  const initialValues = state === 'sign-up'
    ? { name: '', email: '', password: '' }
    : { email: '', password: '' };

  // const initialValues = { name: '', email: '', password: '' };


  const validationSchema = state === "sign-up"
    ? Yup.object({
      name: Yup.string().required("⚠ Required"),
      email: Yup.string().email("⚠ Invalid email").required("⚠ Required"),
      password: Yup.string().min(8, "⚠ must 8+ Charecters").required("⚠ Required"),
    })
    : Yup.object({
      email: Yup.string().email("⚠ Invalid email").required("⚠ Required"),
      password: Yup.string().min(8, "⚠ must 8+ Charecters").required("⚠ Required"),
    });

  
  const handleFormSwitch = (formType: 'login' | 'sign-up') =>{
    setTimeout(() => {
      setState(formType);
    }, 1000);
    if(tree1Ref.current){
      tree1Ref.current.classList.add("shake1");
      setTimeout(() => {
        if (tree1Ref.current) {
          tree1Ref.current.classList.remove("shake1");
        }
      }, 3000);
    }
    if(tree2Ref.current){
      tree2Ref.current.classList.add("shake2");
      setTimeout(() => {
        if (tree2Ref.current) {
          tree2Ref.current.classList.remove("shake2");
        }
      }, 3000);
    }
  }

  const onSubmit = async (values: InitialValueType) => {
    try {

      axios.defaults.withCredentials = true;

      if(state === 'sign-up'){
       const {data} =  await axios.post(`${backendUrl}/api/auth/register`, values);

       if(data.success){
        setIsLoggedin(true);
        getUserData();
        navigate('/email-verify');
       }else{
        toast.error(data.message);
       }
      }else{
        const {data} =  await axios.post(`${backendUrl}/api/auth/login`, values);

       if(data.success){
        setIsLoggedin(true);
        getUserData();
        navigate('/');
       }else{
        toast.error(data.message);
       }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "An error occurred");
    }
  };

  return (
    <div className="login-signUp">
      <img src={assets.coconut_tree2} alt="coconut tree2" className="coconut-tree coconut-tree-left" ref={tree2Ref}/>
      <div className="formfield">
      {state === 'sign-up' ? (
        <div className="sign-log-heading">
          <h2 className="sign-log-heading-text">Create</h2>
          <p className="sign-log-heading-paragraph">Register now to save your favorites, track your activity, and never miss an update.</p>
        </div>
      ) : (
        <div className="sign-log-heading">
          <h2 className="sign-log-heading-text">Login</h2>
          <p className="sign-log-heading-paragraph">Good to see you again! let's get you back in!</p>
        </div>
      )}
      <div className="form-filler">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <Form>
            {state === 'sign-up' && (
              <>
              <div className="inputField">
                <img src={assets.person_icon} alt="person" />
                <Field type="text" name="name" placeholder="Full Name" />
                <ErrorMessage name="name" component="div" className="error-messages" />
              </div>
              </>
            )}

            <div className="inputField" >
              <img src={assets.mail_icon} alt="email" />
              <Field type="text" name="email" placeholder="Email ID" />
              <ErrorMessage name="email" component="div" className="error-messages" />
            </div>

            <div className="inputField">
              <img src={assets.lock_icon} alt="password" />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" className="error-messages" />
            </div>

            {state === 'sign-up' ? (
              <>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  Sign up
                </button>
                <p className="account-exists">
                  Already have an account?{' '}
                  <span className="log-reg-nav" onClick={() => handleFormSwitch('login')}>
                    Login here
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="forgot-password" onClick={() => navigate('/reset-password')} >Forgot Password?</p>
                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  Login
                </button>
                <p className="account-exists">
                  Don't have an account?{' '}
                  <span className="log-reg-nav" onClick={() => handleFormSwitch('sign-up')}>
                    Create here
                  </span>
                </p>
              </>
            )}
          </Form>
        )}
      </Formik>
      </div>
      </div>
      <img src={assets.coconut_tree1} alt="coconut tree1" className="coconut-tree coconut-tree-right" ref={tree1Ref}/>
    </div>
  );
};

export default Login;
