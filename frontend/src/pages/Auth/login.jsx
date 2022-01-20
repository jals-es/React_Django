import React from "react";
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import useLogin from '../../hooks/useLoginMutation'
import { useNavigate } from "react-router-dom";
import './Auth.css'
export default function Login() {
    const navigate = useNavigate();

    const formSchema = Yup.object().shape({
        username: Yup.string()
            .required("Campo requerido")
            .max(50, "Campo demasiado largo"),
        password: Yup.string()
            .required("Campo requerido")
            .max(50, "Campo demasiado largo")
    });

    const { register, handleSubmit, formState: { errors }, reset, setError} = useForm({
        mode: "onTouched",
        resolver: yupResolver(formSchema)
    });

    const loginMutation = useLogin()

    var loginOnSubmit = async(data) => {
        try {
            await loginMutation.mutateAsync(data)
            reset()
            navigate("/");
        } catch (error) {
            if(error.response.data){
                console.log(error.response.data)
                if (error.response.data.non_field_errors) {
                    reset()
                    setError("password", {message: "Usuario o contraseña incorrectos"})
                }
            }
        }
    }

    return (
        <div id='login' className="wrapper">
            <div className="container text-white">
                <h1>Login</h1>
                
                <form className="form" onSubmit={handleSubmit(loginOnSubmit)}>
                    <input type="text" placeholder="Username or email" {...register("username")}/>
                    <p className="text-danger">{errors.username?.message}</p>
                    <input type="password" placeholder="Password" {...register("password")}/>
                    <p className="text-danger">{errors.password?.message}</p>
                    <p className='my-3 text-white'>¿No tienes cuenta? <Link to="/register/">Registrate</Link></p>
                    <button type="submit" id="login-button">Login</button>
                </form>
            </div>
            
            <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    )
}